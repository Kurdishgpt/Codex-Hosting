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
const serverPackages = new Map();

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
      defaultContent = `console.log('Hello from ${name}!');\nconsole.log('Server is ready! Upload your Discord bot files or other code to get started.');\nconsole.log('\\nTo run a Discord bot:');\nconsole.log('1. Upload your bot files');\nconsole.log('2. Add your DISCORD_BOT_TOKEN in Settings > Environment Variables');\nconsole.log('3. The bot will start automatically!\\n');\n`;
    } else if (runtime === 'python') {
      defaultFile = 'main.py';
      defaultContent = `print('Hello from ${name}!')\nprint('Server is ready! Upload your Python bot files or other code to get started.')\nprint('\\nTo run a Discord bot:')\nprint('1. Upload your bot files')\nprint('2. Add your DISCORD_BOT_TOKEN in Settings > Environment Variables')\nprint('3. The bot will start automatically!\\n')\n`;
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
app.post('/api/env/set', async (req, res) => {
  try {
    const { serverId = 'default', key, value } = req.body;
    const envVars = environmentVariables.get(serverId) || {};
    envVars[key] = value;
    environmentVariables.set(serverId, envVars);
    
    // Auto-restart server if Discord bot token is set
    const isDiscordToken = key.toLowerCase().includes('token') || key.toLowerCase().includes('bot');
    if (isDiscordToken && value) {
      // Get server info
      const servers = loadServers();
      const server = servers.find(s => s.id === serverId);
      
      if (server) {
        // Stop if running
        const childProcess = serverProcesses.get(serverId);
        if (childProcess) {
          childProcess.kill();
          serverProcesses.delete(serverId);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Start server with new env vars using smart startup
        await startServerWithSmartStartup(serverId, server.command, server.runtime || 'nodejs', envVars);
        
        res.json({ 
          success: true, 
          message: `Environment variable ${key} set successfully. Server auto-started with new configuration!`,
          autoStarted: true
        });
        return;
      }
    }
    
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

// Package Management Endpoints

// Get packages for a server
app.get('/api/packages', (req, res) => {
  try {
    const { serverId = 'default' } = req.query;
    const packages = serverPackages.get(serverId) || [];
    res.json({ success: true, packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate package name to prevent command injection
const validatePackageName = (packageName) => {
  // Allow only valid npm package name format: @scope/name, name, @scope/name@version
  // This prevents command injection by only allowing alphanumeric, hyphens, underscores, dots, @, and /
  const validPattern = /^(@[a-zA-Z0-9-~][a-zA-Z0-9-._~]*\/)?[a-zA-Z0-9-~][a-zA-Z0-9-._~]*(@[a-zA-Z0-9-._~]+)?$/;
  
  if (!validPattern.test(packageName)) {
    throw new Error('Invalid package name format. Only alphanumeric characters, hyphens, underscores, dots, @, and / are allowed.');
  }
  
  // Additional length check to prevent abuse
  if (packageName.length > 214) {
    throw new Error('Package name is too long (max 214 characters)');
  }
  
  return packageName;
};

// Add package to server
app.post('/api/packages/add', (req, res) => {
  try {
    const { serverId = 'default', packageName } = req.body;
    
    if (!packageName) {
      return res.status(400).json({ success: false, error: 'Package name is required' });
    }

    // Validate package name to prevent command injection
    try {
      validatePackageName(packageName);
    } catch (validationError) {
      return res.status(400).json({ success: false, error: validationError.message });
    }

    const packages = serverPackages.get(serverId) || [];
    
    // Check if package already exists
    if (packages.includes(packageName)) {
      return res.status(400).json({ success: false, error: 'Package already added' });
    }

    packages.push(packageName);
    serverPackages.set(serverId, packages);
    
    res.json({ success: true, message: `Package ${packageName} added successfully`, packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove package from server
app.delete('/api/packages/remove', (req, res) => {
  try {
    const { serverId = 'default', packageName } = req.body;
    
    const packages = serverPackages.get(serverId) || [];
    const filtered = packages.filter(p => p !== packageName);
    
    serverPackages.set(serverId, filtered);
    
    res.json({ success: true, message: `Package ${packageName} removed`, packages: filtered });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all packages
app.post('/api/packages/clear', (req, res) => {
  try {
    const { serverId = 'default' } = req.body;
    serverPackages.set(serverId, []);
    res.json({ success: true, message: 'All packages cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to run a command and wait for completion
const runInstallCommand = (command, cwd, serverId) => {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', ['-c', command], { cwd });
    
    proc.stdout.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stdout', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stdout', message: output });
    });
    
    proc.stderr.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stderr', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stderr', message: output });
    });
    
    proc.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Installation failed with exit code ${code}`));
      }
    });
    
    proc.on('error', (error) => {
      reject(error);
    });
  });
};

// Helper function to start a server with smart startup logic
const startServerWithSmartStartup = async (serverId, command, runtime, envVars = {}) => {
  const serverPath = getServerPath(serverId);
  const packages = serverPackages.get(serverId) || [];
  
  // Initialize console output
  if (!consoleOutputs.has(serverId)) {
    consoleOutputs.set(serverId, []);
  }
  
  // Log startup
  const startupLog = `[CodeX] Starting server...\n`;
  const logs = consoleOutputs.get(serverId) || [];
  logs.push({ type: 'info', message: startupLog, timestamp: new Date() });
  consoleOutputs.set(serverId, logs);
  io.emit(`console:${serverId}`, { type: 'info', message: startupLog });
  
  // Run package installation steps first (synchronously)
  try {
    if (runtime === 'nodejs' || runtime === 'bun') {
      // Check if package.json exists, create if needed
      const packageJsonPath = path.join(serverPath, 'package.json');
      let needsPackageJson = !await fs.pathExists(packageJsonPath);
      
      if (needsPackageJson) {
        // Create basic package.json
        const packageJson = {
          name: serverId,
          version: "1.0.0",
          type: "module",
          description: "Server managed by CodeX Hosting",
          main: "index.js",
          dependencies: {}
        };
        await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
        
        const pkgLog = `[CodeX] Created package.json\n`;
        const logs = consoleOutputs.get(serverId) || [];
        logs.push({ type: 'info', message: pkgLog, timestamp: new Date() });
        consoleOutputs.set(serverId, logs);
        io.emit(`console:${serverId}`, { type: 'info', message: pkgLog });
      }
      
      const packageManager = runtime === 'bun' ? 'bun' : 'npm';
      const nodeModulesPath = path.join(serverPath, 'node_modules');
      
      // Install base dependencies if node_modules doesn't exist
      if (!await fs.pathExists(nodeModulesPath)) {
        const installLog = `[CodeX] Installing base dependencies...\n`;
        const logs = consoleOutputs.get(serverId) || [];
        logs.push({ type: 'info', message: installLog, timestamp: new Date() });
        consoleOutputs.set(serverId, logs);
        io.emit(`console:${serverId}`, { type: 'info', message: installLog });
        
        await runInstallCommand(`${packageManager} install`, serverPath, serverId);
      }
      
      // Install additional packages if specified
      if (packages.length > 0) {
        // Validate all package names
        packages.forEach(pkg => validatePackageName(pkg));
        
        const packagesStr = packages.join(' ');
        const installLog = `[CodeX] Installing packages: ${packagesStr}\n`;
        const logs = consoleOutputs.get(serverId) || [];
        logs.push({ type: 'info', message: installLog, timestamp: new Date() });
        consoleOutputs.set(serverId, logs);
        io.emit(`console:${serverId}`, { type: 'info', message: installLog });
        
        await runInstallCommand(`${packageManager} install ${packagesStr}`, serverPath, serverId);
      }
    } else if (runtime === 'python' && packages.length > 0) {
      // Python package installation
      packages.forEach(pkg => validatePackageName(pkg));
      const packagesStr = packages.join(' ');
      
      const installLog = `[CodeX] Installing Python packages: ${packagesStr}\n`;
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'info', message: installLog, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'info', message: installLog });
      
      await runInstallCommand(`pip install ${packagesStr}`, serverPath, serverId);
    }
    
    // Installations completed successfully - now start the actual command
    const runLog = `[CodeX] Starting application...\n`;
    const logs2 = consoleOutputs.get(serverId) || [];
    logs2.push({ type: 'info', message: runLog, timestamp: new Date() });
    consoleOutputs.set(serverId, logs2);
    io.emit(`console:${serverId}`, { type: 'info', message: runLog });
    
  } catch (installError) {
    // Installation failed - reject immediately
    throw new Error(`Package installation failed: ${installError.message}`);
  }
  
  // Now start the actual process and monitor for readiness
  return new Promise((resolve, reject) => {
    const childProcess = spawn('bash', ['-c', command], {
      cwd: serverPath,
      env: { ...process.env, ...envVars }
    });

    let readinessConfirmed = false;
    let firstOutputReceived = false;
    let processExited = false;
    let survivalTimer = null;

    // Main readiness timeout: if process runs for 10 seconds without output, consider it started
    const readinessTimeout = setTimeout(() => {
      if (!readinessConfirmed && !processExited) {
        readinessConfirmed = true;
        const readyLog = `[CodeX] Server is running\n`;
        const logs = consoleOutputs.get(serverId) || [];
        logs.push({ type: 'info', message: readyLog, timestamp: new Date() });
        consoleOutputs.set(serverId, logs);
        io.emit(`console:${serverId}`, { type: 'info', message: readyLog });
        resolve(childProcess);
      }
    }, 10000);

    // Confirm readiness after receiving output and surviving for a short period
    const confirmReadiness = () => {
      if (readinessConfirmed) return;
      
      if (!firstOutputReceived) {
        firstOutputReceived = true;
        clearTimeout(readinessTimeout);
        
        // Wait 3 more seconds to ensure process doesn't immediately crash
        survivalTimer = setTimeout(() => {
          if (!processExited && !readinessConfirmed) {
            readinessConfirmed = true;
            const readyLog = `[CodeX] Server started successfully\n`;
            const logs = consoleOutputs.get(serverId) || [];
            logs.push({ type: 'info', message: readyLog, timestamp: new Date() });
            consoleOutputs.set(serverId, logs);
            io.emit(`console:${serverId}`, { type: 'info', message: readyLog });
            resolve(childProcess);
          }
        }, 3000);
      }
    };

    childProcess.stdout.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stdout', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stdout', message: output });
      
      confirmReadiness();
    });

    childProcess.stderr.on('data', (data) => {
      const output = data.toString();
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'stderr', message: output, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'stderr', message: output });
      
      confirmReadiness();
    });

    childProcess.on('error', (error) => {
      clearTimeout(readinessTimeout);
      if (survivalTimer) clearTimeout(survivalTimer);
      serverProcesses.delete(serverId);
      if (!readinessConfirmed) {
        reject(new Error(`Failed to start: ${error.message}`));
      }
    });

    childProcess.on('exit', (code) => {
      clearTimeout(readinessTimeout);
      if (survivalTimer) clearTimeout(survivalTimer);
      processExited = true;
      
      const message = `[CodeX] Process exited with code ${code}\n`;
      const logs = consoleOutputs.get(serverId) || [];
      logs.push({ type: 'info', message, timestamp: new Date() });
      consoleOutputs.set(serverId, logs);
      io.emit(`console:${serverId}`, { type: 'info', message });
      serverProcesses.delete(serverId);
      
      if (!readinessConfirmed) {
        if (code !== 0) {
          reject(new Error(`Server failed to start and exited with code ${code}`));
        } else {
          reject(new Error(`Server exited immediately (exit code 0)`));
        }
      }
    });

    serverProcesses.set(serverId, childProcess);
  });
};

// Server Control Endpoints

// Start server
app.post('/api/server/start', async (req, res) => {
  try {
    const { serverId = 'default', command = 'node index.js', runtime = 'nodejs' } = req.body;
    
    if (serverProcesses.has(serverId)) {
      return res.json({ success: false, error: 'Server is already running' });
    }

    const envVars = environmentVariables.get(serverId) || {};
    await startServerWithSmartStartup(serverId, command, runtime, envVars);

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
    const { serverId = 'default', command = 'node index.js', runtime = 'nodejs' } = req.body;
    
    // Stop if running
    const childProcess = serverProcesses.get(serverId);
    if (childProcess) {
      childProcess.kill();
      serverProcesses.delete(serverId);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Start again using smart startup
    const envVars = environmentVariables.get(serverId) || {};
    await startServerWithSmartStartup(serverId, command, runtime, envVars);

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
