import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import archiver from 'archiver';
import unzipper from 'unzipper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const serverId = req.body.serverId || 'default';
      const sanitizedServerId = validateServerId(serverId);
      const uploadPath = path.join(__dirname, 'uploads', 'servers', sanitizedServerId);
      fs.ensureDirSync(uploadPath);
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Server instances storage
const serverProcesses = new Map();
const consoleOutputs = new Map();
const environmentVariables = new Map();

// Validate serverId to prevent directory traversal
const validateServerId = (serverId) => {
  // Only allow alphanumeric characters, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(serverId)) {
    throw new Error('Invalid serverId: only alphanumeric characters, hyphens, and underscores are allowed');
  }
  return serverId;
};

// Default server path
const getServerPath = (serverId = 'default') => {
  const sanitizedServerId = validateServerId(serverId);
  return path.join(__dirname, 'uploads', 'servers', sanitizedServerId);
};

// Validate and sanitize file paths to prevent directory traversal
const sanitizePath = (serverPath, userPath) => {
  // Resolve the full path
  const resolved = path.resolve(serverPath, userPath);
  
  // Ensure serverPath has a trailing separator for accurate comparison
  const normalizedServerPath = serverPath.endsWith(path.sep) ? serverPath : serverPath + path.sep;
  
  // Ensure the resolved path is within the server directory
  if (!resolved.startsWith(normalizedServerPath) && resolved !== serverPath.replace(/[\/\\]$/, '')) {
    throw new Error('Invalid path: directory traversal detected');
  }
  
  return resolved;
};

// Initialize default server
fs.ensureDirSync(getServerPath());

// File Manager Endpoints

// List files in directory
app.get('/api/files', async (req, res) => {
  try {
    const { serverId = 'default', dir = '/' } = req.query;
    const serverPath = getServerPath(serverId);
    const targetPath = sanitizePath(serverPath, dir);
    
    const files = await fs.readdir(targetPath, { withFileTypes: true });
    const fileList = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(targetPath, file.name);
        const stats = await fs.stat(filePath);
        return {
          name: file.name,
          isDirectory: file.isDirectory(),
          size: stats.size,
          modified: stats.mtime,
          path: path.join(dir, file.name)
        };
      })
    );

    res.json({ success: true, files: fileList, currentPath: dir });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload files
app.post('/api/files/upload', upload.array('files'), async (req, res) => {
  try {
    const { serverId = 'default', dir = '/', extract = 'false' } = req.body;
    const serverPath = getServerPath(serverId);
    const targetPath = sanitizePath(serverPath, dir);

    if (extract === 'true' && req.files.length > 0) {
      // Extract zip files
      for (const file of req.files) {
        if (file.originalname.endsWith('.zip')) {
          const zipPath = file.path;
          await fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: targetPath }))
            .promise();
          // Don't remove the zip file, keep it
        }
      }
    }

    res.json({ 
      success: true, 
      message: `Uploaded ${req.files.length} file(s)`,
      files: req.files.map(f => f.originalname)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new file
app.post('/api/files/create', async (req, res) => {
  try {
    const { serverId = 'default', path: filePath, content = '', isDirectory = false } = req.body;
    const serverPath = getServerPath(serverId);
    const targetPath = sanitizePath(serverPath, filePath);

    if (isDirectory) {
      await fs.ensureDir(targetPath);
    } else {
      await fs.writeFile(targetPath, content);
    }

    res.json({ success: true, message: `Created ${isDirectory ? 'directory' : 'file'}: ${filePath}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Read file content
app.get('/api/files/read', async (req, res) => {
  try {
    const { serverId = 'default', path: filePath } = req.query;
    const serverPath = getServerPath(serverId);
    const targetPath = sanitizePath(serverPath, filePath);

    const content = await fs.readFile(targetPath, 'utf-8');
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update file content
app.post('/api/files/update', async (req, res) => {
  try {
    const { serverId = 'default', path: filePath, content } = req.body;
    const serverPath = getServerPath(serverId);
    const targetPath = sanitizePath(serverPath, filePath);

    await fs.writeFile(targetPath, content);
    res.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete files/directories
app.delete('/api/files/delete', async (req, res) => {
  try {
    const { serverId = 'default', paths } = req.body;
    const serverPath = getServerPath(serverId);

    for (const filePath of paths) {
      const targetPath = sanitizePath(serverPath, filePath);
      await fs.remove(targetPath);
    }

    res.json({ success: true, message: `Deleted ${paths.length} item(s)` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all files
app.post('/api/files/clear', async (req, res) => {
  try {
    const { serverId = 'default' } = req.body;
    const serverPath = getServerPath(serverId);

    await fs.emptyDir(serverPath);
    res.json({ success: true, message: 'All files cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Move/Rename files
app.post('/api/files/move', async (req, res) => {
  try {
    const { serverId = 'default', source, destination } = req.body;
    const serverPath = getServerPath(serverId);
    const sourcePath = sanitizePath(serverPath, source);
    const destPath = sanitizePath(serverPath, destination);

    await fs.move(sourcePath, destPath, { overwrite: true });
    res.json({ success: true, message: 'File moved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Environment Variables Endpoints

// Get environment variables
app.get('/api/env', (req, res) => {
  const { serverId = 'default' } = req.query;
  const envVars = environmentVariables.get(serverId) || {};
  res.json({ success: true, variables: envVars });
});

// Set environment variable
app.post('/api/env/set', (req, res) => {
  try {
    const { serverId = 'default', key, value } = req.body;
    const envVars = environmentVariables.get(serverId) || {};
    envVars[key] = value;
    environmentVariables.set(serverId, envVars);
    res.json({ success: true, message: `Environment variable ${key} set successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete environment variable
app.delete('/api/env/delete', (req, res) => {
  try {
    const { serverId = 'default', key } = req.body;
    const envVars = environmentVariables.get(serverId) || {};
    delete envVars[key];
    environmentVariables.set(serverId, envVars);
    res.json({ success: true, message: `Environment variable ${key} deleted` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server Control Endpoints

// Start server
app.post('/api/server/start', (req, res) => {
  try {
    const { serverId = 'default', command = 'node index.js', runtime = 'nodejs' } = req.body;
    
    if (serverProcesses.has(serverId)) {
      return res.json({ success: false, error: 'Server is already running' });
    }

    const serverPath = getServerPath(serverId);
    const envVars = environmentVariables.get(serverId) || {};
    
    // Determine the command to run based on runtime
    let cmd, args;
    const commandParts = command.split(' ');
    cmd = commandParts[0];
    args = commandParts.slice(1);

    const process = spawn(cmd, args, {
      cwd: serverPath,
      env: { ...process.env, ...envVars }
    });

    // Initialize console output
    consoleOutputs.set(serverId, []);

    process.stdout.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stdout', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stdout', message: output });
    });

    process.stderr.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stderr', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stderr', message: output });
    });

    process.on('exit', (code) => {
      const message = `Process exited with code ${code}`;
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'info', message, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'info', message });
      serverProcesses.delete(serverId);
    });

    serverProcesses.set(serverId, process);

    res.json({ success: true, message: 'Server started successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stop server
app.post('/api/server/stop', (req, res) => {
  try {
    const { serverId = 'default' } = req.body;
    const process = serverProcesses.get(serverId);

    if (!process) {
      return res.json({ success: false, error: 'Server is not running' });
    }

    process.kill();
    serverProcesses.delete(serverId);

    res.json({ success: true, message: 'Server stopped successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Restart server
app.post('/api/server/restart', async (req, res) => {
  try {
    const { serverId = 'default', command, runtime } = req.body;
    
    // Stop if running
    const process = serverProcesses.get(serverId);
    if (process) {
      process.kill();
      serverProcesses.delete(serverId);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Start again
    const startResponse = await fetch('http://localhost:3001/api/server/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, command, runtime })
    });

    res.json({ success: true, message: 'Server restarted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get server status
app.get('/api/server/status', (req, res) => {
  const { serverId = 'default' } = req.query;
  const isRunning = serverProcesses.has(serverId);
  const logs = consoleOutputs.get(serverId) || [];
  
  res.json({ 
    success: true, 
    status: isRunning ? 'running' : 'stopped',
    logs: logs.slice(-100) // Last 100 logs
  });
});

// Clear console
app.post('/api/console/clear', (req, res) => {
  try {
    const { serverId = 'default' } = req.body;
    consoleOutputs.set(serverId, []);
    io.emit(`console:${serverId}`, { type: 'clear' });
    res.json({ success: true, message: 'Console cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send command to console
app.post('/api/console/command', (req, res) => {
  try {
    const { serverId = 'default', command } = req.body;
    const process = serverProcesses.get(serverId);

    if (!process) {
      return res.json({ success: false, error: 'Server is not running' });
    }

    process.stdin.write(command + '\n');
    res.json({ success: true, message: 'Command sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket connection for real-time console
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe', (serverId) => {
    console.log(`Client subscribed to server: ${serverId}`);
    const logs = consoleOutputs.get(serverId) || [];
    socket.emit(`console:${serverId}`, { type: 'history', logs });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Hosting backend server running on port ${PORT}`);
});
