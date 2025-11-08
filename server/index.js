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
  // Normalize userPath to remove leading slashes and dots
  let normalizedUserPath = userPath.replace(/^[\/\\]+/, '').replace(/^\.+/, '');
  
  // If normalized path is empty, use current directory
  if (!normalizedUserPath) {
    normalizedUserPath = '.';
  }
  
  // Resolve the full path
  const resolved = path.resolve(serverPath, normalizedUserPath);
  
  // Ensure serverPath has a trailing separator for accurate comparison
  const normalizedServerPath = serverPath.endsWith(path.sep) ? serverPath : serverPath + path.sep;
  
  // Ensure the resolved path is within the server directory
  if (!resolved.startsWith(normalizedServerPath) && resolved !== serverPath) {
    throw new Error('Invalid path: directory traversal detected');
  }
  
  return resolved;
};

// Initialize default server
fs.ensureDirSync(getServerPath());

// Server storage file
const serversDataFile = path.join(__dirname, 'servers.json');

// Load servers from file
const loadServers = () => {
  try {
    if (fs.existsSync(serversDataFile)) {
      const data = fs.readFileSync(serversDataFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading servers:', error);
  }
  return [];
};

// Save servers to file
const saveServers = (servers) => {
  try {
    fs.writeFileSync(serversDataFile, JSON.stringify(servers, null, 2));
  } catch (error) {
    console.error('Error saving servers:', error);
  }
};

// Server Management Endpoints

// Create a new server
app.post('/api/servers/create', async (req, res) => {
  try {
    const { name, runtime, version, command, description, cpu, memory, disk, location } = req.body;
    
    if (!name || !runtime) {
      return res.status(400).json({ success: false, error: 'Name and runtime are required' });
    }

    const serverId = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    validateServerId(serverId);

    const servers = loadServers();
    
    // Check if server already exists
    if (servers.find(s => s.id === serverId)) {
      return res.status(400).json({ success: false, error: 'Server with this name already exists' });
    }

    // Set default command based on runtime
    let defaultCommand = 'node index.js';
    if (runtime === 'python') {
      defaultCommand = 'python main.py';
    } else if (runtime === 'bun') {
      defaultCommand = 'bun index.js';
    } else if (runtime === 'java') {
      defaultCommand = 'java Main';
    } else if (runtime === 'rust') {
      defaultCommand = 'cargo run';
    } else if (runtime === 'lua') {
      defaultCommand = 'lua main.lua';
    } else if (runtime === 'csharp') {
      defaultCommand = 'dotnet run';
    }

    const server = {
      id: serverId,
      name,
      runtime,
      version: version || 'latest',
      command: command || defaultCommand,
      description: description || '',
      cpu: cpu || '50%',
      memory: memory || '512 MB',
      disk: disk || '1 GB',
      location: location || 'United States',
      status: 'stopped',
      createdAt: new Date().toISOString()
    };

    // Create server directory
    const serverPath = getServerPath(serverId);
    await fs.ensureDir(serverPath);

    // Create a default index file based on runtime
    let defaultContent = '';
    let defaultFile = '';
    
    if (runtime === 'nodejs' || runtime === 'bun') {
      defaultFile = 'index.js';
      defaultContent = `console.log('Hello from ${name}!');\n\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, {'Content-Type': 'text/plain'});\n  res.end('Server is running!\\n');\n});\n\nconst PORT = process.env.PORT || 3000;\nserver.listen(PORT, () => {\n  console.log(\`Server listening on port \${PORT}\`);\n});\n`;
    } else if (runtime === 'python') {
      defaultFile = 'main.py';
      defaultContent = `print('Hello from ${name}!')\n\nimport http.server\nimport socketserver\n\nPORT = 8000\n\nHandler = http.server.SimpleHTTPRequestHandler\n\nwith socketserver.TCPServer(("", PORT), Handler) as httpd:\n    print(f"Server running on port {PORT}")\n    httpd.serve_forever()\n`;
    } else {
      defaultFile = 'README.txt';
      defaultContent = `Welcome to ${name}!\n\nThis is a ${runtime} server.\n\nAdd your files here to get started.`;
    }

    await fs.writeFile(path.join(serverPath, defaultFile), defaultContent);

    servers.push(server);
    saveServers(servers);

    res.json({ success: true, server });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all servers
app.get('/api/servers', (req, res) => {
  try {
    const servers = loadServers();
    res.json({ success: true, servers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single server
app.get('/api/servers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const servers = loadServers();
    const server = servers.find(s => s.id === id);
    
    if (!server) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    // Add status from running processes
    server.status = serverProcesses.has(id) ? 'running' : 'stopped';
    
    res.json({ success: true, server });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update server
app.put('/api/servers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const servers = loadServers();
    const index = servers.findIndex(s => s.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    servers[index] = { ...servers[index], ...updates, id, updatedAt: new Date().toISOString() };
    saveServers(servers);
    
    res.json({ success: true, server: servers[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete server
app.delete('/api/servers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const servers = loadServers();
    const index = servers.findIndex(s => s.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    // Stop server if running
    if (serverProcesses.has(id)) {
      const process = serverProcesses.get(id);
      process.kill();
      serverProcesses.delete(id);
    }

    // Delete server directory
    const serverPath = getServerPath(id);
    await fs.remove(serverPath);

    servers.splice(index, 1);
    saveServers(servers);
    
    res.json({ success: true, message: 'Server deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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

    const childProcess = spawn(cmd, args, {
      cwd: serverPath,
      env: { ...process.env, ...envVars }
    });

    // Initialize console output
    consoleOutputs.set(serverId, []);

    childProcess.stdout.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stdout', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stdout', message: output });
    });

    childProcess.stderr.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stderr', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stderr', message: output });
    });

    childProcess.on('exit', (code) => {
      const message = `Process exited with code ${code}`;
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'info', message, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'info', message });
      serverProcesses.delete(serverId);
    });

    serverProcesses.set(serverId, childProcess);

    res.json({ success: true, message: 'Server started successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stop server
app.post('/api/server/stop', (req, res) => {
  try {
    const { serverId = 'default' } = req.body;
    const childProcess = serverProcesses.get(serverId);

    if (!childProcess) {
      return res.json({ success: false, error: 'Server is not running' });
    }

    childProcess.kill();
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
    const childProcess = serverProcesses.get(serverId);
    if (childProcess) {
      childProcess.kill();
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
    const childProcess = serverProcesses.get(serverId);

    if (!childProcess) {
      return res.json({ success: false, error: 'Server is not running' });
    }

    childProcess.stdin.write(command + '\n');
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
