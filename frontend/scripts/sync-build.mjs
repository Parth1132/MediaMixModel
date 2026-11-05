import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(frontendDir, '..');
const distDir = path.resolve(frontendDir, 'dist');
const docsDir = path.resolve(repoRoot, 'docs');

console.log('📦 Syncing React build to root and docs/ for GitHub Pages...');

// 1. Copy dist/assets to docs/assets and repoRoot/assets
const distAssets = path.join(distDir, 'assets');
const docsAssets = path.join(docsDir, 'assets');
const rootAssets = path.join(repoRoot, 'assets');

fs.mkdirSync(docsAssets, { recursive: true });
fs.mkdirSync(rootAssets, { recursive: true });

for (const file of fs.readdirSync(distAssets)) {
  fs.copyFileSync(path.join(distAssets, file), path.join(docsAssets, file));
  fs.copyFileSync(path.join(distAssets, file), path.join(rootAssets, file));
}

// 2. Copy dist/index.html to docs/index.html and repoRoot/index.html
const distIndex = path.join(distDir, 'index.html');
fs.copyFileSync(distIndex, path.join(docsDir, 'index.html'));
fs.copyFileSync(distIndex, path.join(repoRoot, 'index.html'));

console.log('✅ Successfully synced React bundle to root and docs/!');
