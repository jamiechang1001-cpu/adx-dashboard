const fs = require('fs');
const path = require('path');

const distDir = 'c:/Users/MeetYou/qoder/dist';
const assetsDir = path.join(distDir, 'assets');
const htmlPath = path.join(distDir, 'index.html');
const outPath = 'c:/Users/MeetYou/Desktop/广告投放运营后台.html';

let html = fs.readFileSync(htmlPath, 'utf-8');
const cssFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.css'));
const jsFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.js'));
const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
let js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');

// Escape </script> in JS to prevent early script tag closing
js = js.replace(/<\/script>/gi, '<\\/script>');

// Build inline HTML
const inlineHtml = html
  .replace(/<script[^>]*src="[^"]*"><\/script>/, '<script type="module">\n' + js + '\n</script>')
  .replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]*"[^>]*>/, '<style>\n' + css + '\n</style>')
  .replace(/<link rel="icon"[^>]*>/, '')
  .replace(/<title>[^<]*<\/title>/, '<title>广告投放运营后台</title>');

fs.writeFileSync(outPath, inlineHtml, 'utf-8');
console.log('Done');
