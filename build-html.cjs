const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// Read index.html
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Find JS and CSS references
const jsMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const cssMatch = html.match(/<link[^>]+href="([^"]+)"[^>]*>/);

if (!jsMatch) {
  console.error('JS script not found in index.html');
  process.exit(1);
}

const jsPath = jsMatch[1].replace('/adx-dashboard/', '');
const cssPath = cssMatch ? cssMatch[1].replace('/adx-dashboard/', '') : null;

// Read and inline CSS
if (cssPath) {
  const cssFile = path.join(distDir, cssPath);
  const cssContent = fs.readFileSync(cssFile, 'utf-8');
  html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
}

// Read and inline JS
const jsFile = path.join(distDir, jsPath);
let jsContent = fs.readFileSync(jsFile, 'utf-8');

// Escape </script> to prevent premature script tag closing
jsContent = jsContent.replace(/<\/script>/gi, '<\\/script>');

html = html.replace(jsMatch[0], `<script>${jsContent}</script>`);

// Update title
html = html.replace('<title>qoder</title>', '<title>广告投放运营后台</title>');

// Fix favicon path for local file opening
html = html.replace('href="/adx-dashboard/favicon.svg"', 'href="./favicon.svg"');

// Write output
const outputPath = path.join(__dirname, 'adx-dashboard.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log(`Created: ${outputPath}`);
console.log(`Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
