// Build Vercel: concatena partes -> arquivos finais + decodifica imagens b64
const fs = require('fs');

// 1) HTML: concatena index.part1..4.html -> index.html
const html = ['index.part1.html','index.part2.html','index.part3.html','index.part4.html']
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('index.html', html);

// 2) CSS: concatena styles.part1..2.css -> assets/styles.css
const css = ['assets/styles.part1.css','assets/styles.part2.css']
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('assets/styles.css', css);

// 3) Imagens: decodifica chunks b64 -> og-image.jpg e favicon.png
const cat = p => fs.readdirSync('.').filter(f => f.startsWith(p)).sort()
  .map(f => fs.readFileSync(f, 'utf8')).join('');
fs.writeFileSync('og-image.jpg', Buffer.from(cat('og-p0'), 'base64'));
fs.writeFileSync('favicon.png', Buffer.from(cat('favicon-p0'), 'base64'));

console.log('build OK | index:', html.length, 'bytes | css:', css.length, 'bytes');
