const fs = require('fs');
const path = require('path');

// --- Configuration ---
const rootDir = process.cwd();
const outputFile = 'technical_snapshot.txt';
const scriptPath = __filename; // Gets the full path of the script itself.

const ignorePatterns = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.vscode',
  '.idea',
  outputFile, // Exclude the output file itself
  path.basename(scriptPath) // Exclude the script file itself by its name
];

const includeExtensions = [
  '.js', '.ts', '.jsx', '.tsx',
  '.json',
  '.css', '.scss', '.less',
  '.html',
  '.md',
  '.sh', '.yml', '.yaml',
  'vite.config.ts', 'tailwind.config.js', 'postcss.config.js', 'eslint.config.js', 'netlify.toml'
];
// --- End Configuration ---

let outputContent = '';

// Function to generate a file tree structure
function generateFileTree(dir, prefix = '') {
  let tree = '';
  const files = fs.readdirSync(dir);
  const filteredFiles = files.filter(file => !ignorePatterns.includes(file));

  filteredFiles.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const isLast = index === filteredFiles.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    tree += `${prefix}${connector}${file}\n`;

    try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          tree += generateFileTree(filePath, newPrefix);
        }
    } catch (error) {
        // Ignore errors for files that might be gone during the process (e.g. temp files)
    }
  });
  return tree;
}


// Function to recursively read files
function readDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    // Check if the file or directory should be ignored
    if (ignorePatterns.some(pattern => filePath.includes(pattern))) {
      continue;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readDirectory(filePath);
    } else if (includeExtensions.some(ext => file.endsWith(ext) || file === ext)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        outputContent += `--- File: ${path.relative(rootDir, filePath)} ---\n\n`;
        outputContent += `${content}\n\n`;
      } catch (error) {
        outputContent += `--- File: ${path.relative(rootDir, filePath)} ---\n\n`;
        outputContent += `Error reading file: ${error.message}\n\n`;
      }
    }
  }
}

// --- Script Execution ---
console.log('🚀 Starting repository analysis...');

// 1. Add a header
outputContent += '==================================================\n';
outputContent += '    Technical Snapshot of the Repository\n';
outputContent += '==================================================\n\n';
outputContent += `Analysis generated on: ${new Date().toUTCString()}\n\n`;


// 2. Add package.json content first for context
try {
    const packageJsonContent = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8');
    outputContent += '--- File: package.json ---\n\n';
    outputContent += `${packageJsonContent}\n\n`;
} catch (error) {
    console.warn('Warning: Could not read package.json. It will be skipped.');
}


// 3. Generate and add the file structure tree
outputContent += '--------------------------------------------------\n';
outputContent += '               Project Structure\n';
outputContent += '--------------------------------------------------\n\n';
outputContent += `${rootDir}\n`;
outputContent += generateFileTree(rootDir);
outputContent += '\n\n';


// 4. Add the content of all other relevant files
outputContent += '--------------------------------------------------\n';
outputContent += '                 File Contents\n';
outputContent += '--------------------------------------------------\n\n';

readDirectory(rootDir);

// 5. Write the final output file
try {
  fs.writeFileSync(path.join(rootDir, outputFile), outputContent);
  console.log('✅ Analysis complete!');
  console.log(`📄 Snapshot saved to: ${outputFile}`);
} catch (error) {
  console.error(`❌ Error writing output file: ${error.message}`);
}
