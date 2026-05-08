const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GIT = path.join(__dirname, 'mingit', 'cmd', 'git.exe');
const DEPLOY_DIR = path.join(__dirname, 'deploy');
const DIST_DIR = path.join(__dirname, 'dist');

function run(cmd, cwd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanDeployDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

console.log('Pushing source code to main branch...');
run(`${GIT} add -A`, __dirname);
try {
  run(`${GIT} commit -m "Update source: ${new Date().toISOString()}"`, __dirname);
} catch {
  console.log('No source changes to commit');
}
run(`${GIT} push origin main`, __dirname);

console.log('\nBuilding project...');
run('npm run build', __dirname);

console.log('\nCopying dist to deploy...');
cleanDeployDir(DEPLOY_DIR);
copyDir(DIST_DIR, DEPLOY_DIR);

console.log('\nDeploying to GitHub Pages...');
run(`${GIT} add -A`, DEPLOY_DIR);
try {
  run(`${GIT} commit -m "Update pages: ${new Date().toISOString()}"`, DEPLOY_DIR);
} catch {
  console.log('No page changes to commit');
}
run(`${GIT} push origin master:gh-pages`, DEPLOY_DIR);

console.log('\nDone! Your site will be live shortly at:');
console.log('https://jamiechang1001-cpu.github.io/adx-dashboard/');
