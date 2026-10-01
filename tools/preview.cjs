const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.pdf':'application/pdf','.md':'text/plain; charset=utf-8'};
function createServer() {
  return http.createServer((request,response) => {
    let pathname;
    try { pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname); }
    catch { response.writeHead(400);response.end();return; }
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    const relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)||relative.startsWith('.git')){response.writeHead(403);response.end();return;}
    fs.readFile(file,(error,data)=>{
      if(error){response.writeHead(404);response.end('Not found');return;}
      response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
      response.setHeader('Cache-Control','no-cache');
      response.end(request.method==='HEAD'?undefined:data);
    });
  });
}
if(require.main===module){
  const port=Number(process.argv[2])||8000;
  const server=createServer();
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Try: node tools/preview.cjs 8001`:error.message);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}\nKeep this terminal open. Ctrl+C stops the server.`));
}
module.exports={createServer};
