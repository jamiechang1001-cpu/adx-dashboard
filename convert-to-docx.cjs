const fs = require('fs');
const { marked } = require('marked');
const HTMLtoDOCX = require('html-to-docx');

async function convert() {
  const mdPath = './PRD-动态内容池管理功能.md';
  const outputPath = './PRD-动态内容池管理功能.docx';

  const markdown = fs.readFileSync(mdPath, 'utf-8');
  const html = marked(markdown);

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: "Microsoft YaHei", "SimSun", sans-serif; font-size: 11pt; line-height: 1.6; }
        h1 { font-size: 18pt; color: #333; margin-top: 24pt; margin-bottom: 12pt; }
        h2 { font-size: 14pt; color: #444; margin-top: 18pt; margin-bottom: 10pt; }
        h3 { font-size: 12pt; color: #555; margin-top: 14pt; margin-bottom: 8pt; }
        table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
        th, td { border: 1px solid #ccc; padding: 6pt 8pt; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        code { background-color: #f4f4f4; padding: 2pt 4pt; font-family: monospace; }
        pre { background-color: #f4f4f4; padding: 10pt; overflow-x: auto; }
        blockquote { border-left: 3px solid #ccc; margin: 10pt 0; padding-left: 10pt; color: #666; }
        ul, ol { margin: 8pt 0; padding-left: 24pt; }
        li { margin: 3pt 0; }
        p { margin: 6pt 0; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;

  const docxBuffer = await HTMLtoDOCX(fullHtml, null, {
    title: 'PRD-动态内容池管理功能',
    creator: 'Qoder',
    font: 'Microsoft YaHei',
  });

  fs.writeFileSync(outputPath, docxBuffer);
  console.log('转换成功！文件已保存到:', outputPath);
}

convert().catch(err => {
  console.error('转换失败:', err);
  process.exit(1);
});
