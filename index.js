const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');

// Load configuration or set default paths
function loadConfig() {
  const configPath = path.join(__dirname, 'config.json');
  
  if (fs.existsSync(configPath)) {
    const config = fs.readJsonSync(configPath, { throws: false }) || {};
    return {
      sourceDir: path.resolve(config.sourceDir),
      targetDir: path.resolve(config.targetDir),
    };
  } else {
    console.log('config.json not found. Using default paths.');
    // Default paths if config.json doesn't exist
    const defaultSource = path.join(__dirname, 'src');
    const defaultTarget = path.join(__dirname, 'target');
    return { sourceDir: defaultSource, targetDir: defaultTarget };
  }
}

// Load configuration
const { sourceDir, targetDir } = loadConfig();

// Function to copy file with retry logic
async function copyFileWithRetry(filePath, maxAttempts = 10, delay = 2000) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const relativePath = path.relative(sourceDir, filePath);
      const targetPath = path.join(targetDir, relativePath);

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(filePath, targetPath);
      console.log(`File copied successfully: ${filePath} -> ${targetPath}`);
      return;
    } catch (error) {
      if (error.code === 'EBUSY' || error.message.includes('being used by another process')) {
        console.log(`File is busy, retrying (attempt ${attempt + 1} of ${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error(`Error copying file ${filePath}:`, error);
        break;
      }
    }
  }
}

// Ensure directories exist
async function ensureDirsExist() {
  try {
    await fs.ensureDir(sourceDir);
    console.log(`Source directory ensured: ${sourceDir}`);

    await fs.ensureDir(targetDir);
    console.log(`Target directory ensured: ${targetDir}`);
  } catch (error) {
    console.error('Error ensuring directories:', error);
    process.exit(1); // Exit if directories cannot be created
  }
}

// Initialize file watcher
const watcher = chokidar.watch(sourceDir, {
  ignored: /(^|[\/\\])\../, // Ignore hidden files
  persistent: true, 
  usePolling: true,
  interval: 1000,
  ignoreInitial: true,
});

watcher
  .on('add', (filePath) => {
    console.log(`File added: ${filePath}`);
    copyFileWithRetry(filePath);
  })
  .on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    copyFileWithRetry(filePath);
  })
  .on('unlink', (filePath) => {
    const relativePath = path.relative(sourceDir, filePath);
    const targetPath = path.join(targetDir, relativePath);
    fs.remove(targetPath, (err) => {
      if (err) {
        console.error(`Error removing file ${targetPath}:`, err);
      } else {
        console.log(`File deleted: ${targetPath}`);
      }
    });
  })
  .on('error', (error) => {
    console.error('Error with file watcher:', error);
  });

// Ensure directories exist and start watcher
ensureDirsExist().then(() => {
  console.log(`Watching for changes in folder: ${sourceDir}`);
});
