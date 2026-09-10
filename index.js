const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end(`
    <div style="background:#0b0f19; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
      <h1 style="color:#f59e0b;">🛡️ Hermes Workspace Dashboard</h1>
      <p>Status: Online & Ready (Zero Cost)</p>
      <p style="color:#22c55e;">Connected to Cloud Successfully!</p>
    </div>
  `);
});

server.listen(process.env.PORT || 10000, () => {
  console.log('Hermes Server is live!');
});
