import http from 'http';
import fs from 'fs';
import path from 'path';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join('c:/envmoss', file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(48921, async () => {
  console.log('Server running on port 48921...');
  const endpoints = ['/', '/css/styles.css', '/js/app.js', '/js/env-engine.js', '/js/output-generator.js'];
  let allOk = true;
  for (const ep of endpoints) {
    const resp = await fetch('http://127.0.0.1:48921' + ep);
    const text = await resp.text();
    console.log(`Endpoint: ${ep} -> Status: ${resp.status}, Content-Length: ${text.length}, Type: ${resp.headers.get('content-type')}`);
    if (resp.status !== 200 || text.length === 0) {
      allOk = false;
    }
  }
  server.close(() => {
    console.log(allOk ? 'ALL STATIC ASSETS ACCESSIBLE (200 OK)' : 'SOME ASSETS FAILED');
    if (!allOk) process.exit(1);
  });
});
