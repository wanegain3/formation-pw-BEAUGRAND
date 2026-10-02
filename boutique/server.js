const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split('?')[0]);

  let filePath = path.join(ROOT, requestPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8'
    });

    return res.end('404 - Fichier introuvable');
  }

  const ext = path.extname(filePath).toLowerCase();

  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});