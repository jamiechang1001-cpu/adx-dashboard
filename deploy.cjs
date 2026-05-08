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

console.log('Building project...');
run('npm run build', __dirname);

console.log('\nCopying dist to deploy...');
fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
copyDir(DIST_DIR, DEPLOY_DIR);

console.log('\nDeploying to GitHub Pages...');
run(`${GIT} add -A`, DEPLOY_DIR);
try {
  run(`${GIT} commit -m "Update: ${new Date().toISOString()}"`, DEPLOY_DIR);
} catch {
  console.log('No changes to commit');
}
run(`${GIT} push origin gh-pages`, DEPLOY_DIR);

console.log('\nDone! Your site will be live shortly at:');
console.log('https://jamiechang1001-cpu.github.io/adx-dashboard/');
