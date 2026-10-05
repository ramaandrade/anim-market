import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Preparing source index.html from index.dev.html...');
const devHtmlPath = path.join(rootDir, 'index.dev.html');
const rootHtmlPath = path.join(rootDir, 'index.html');
fs.copyFileSync(devHtmlPath, rootHtmlPath);

console.log('📦 Running tsc -b && vite build...');
execSync('npx vite build', { cwd: rootDir, stdio: 'inherit' });

const docsDir = path.join(rootDir, 'docs');
if (!fs.existsSync(docsDir)) {
  console.error('❌ docs directory not found after build!');
  process.exit(1);
}

console.log('📋 Synchronizing built assets to root for universal GitHub Pages support...');
// Copy docs/index.html to root index.html
fs.copyFileSync(path.join(docsDir, 'index.html'), rootHtmlPath);

// Sync js/ directory
const docsJsDir = path.join(docsDir, 'js');
const rootJsDir = path.join(rootDir, 'js');
if (fs.existsSync(docsJsDir)) {
  if (fs.existsSync(rootJsDir)) {
    fs.rmSync(rootJsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(rootJsDir, { recursive: true });
  for (const file of fs.readdirSync(docsJsDir)) {
    fs.copyFileSync(path.join(docsJsDir, file), path.join(rootJsDir, file));
  }
}

// Sync css/ directory
const docsCssDir = path.join(docsDir, 'css');
const rootCssDir = path.join(rootDir, 'css');
if (fs.existsSync(docsCssDir)) {
  if (fs.existsSync(rootCssDir)) {
    fs.rmSync(rootCssDir, { recursive: true, force: true });
  }
  fs.mkdirSync(rootCssDir, { recursive: true });
  for (const file of fs.readdirSync(docsCssDir)) {
    fs.copyFileSync(path.join(docsCssDir, file), path.join(rootCssDir, file));
  }
}

// Ensure .nojekyll in root
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '# Disable Jekyll\n');

console.log('✅ Build and synchronization completed successfully!');
