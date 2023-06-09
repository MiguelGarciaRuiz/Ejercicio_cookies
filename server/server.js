const http = require('http');

const hostname = 'localhost'; //localhost
const port = 8000;

const server = http.createServer((request, response) => {

  if (request.method == 'POST') {
      console.log('POST')
      var body = ''

      request.on('data', function(data) {
        body += data
      })

      request.on('end', function() {
        console.log('Body: ' + body)
        response.setHeader('Access-Control-Allow-Origin', '*'); //ESTO ES PARA EL CORS
        response.writeHead(200, {'Content-Type': 'application.JSON'})
        response.end(JSON.stringify({
          ok: true,
          nombre: "Copata",
          id: 1234,
          pass: "fdsa"
        }))
      })
  } else {
    console.log('GET')
    response.statusCode = 200;
    response.setHeader('Access-Control-Allow-Origin', '*'); //ESTO ES PARA EL CORS
    response.setHeader('Content-Type', 'text/plain');
    response.end('Hola chaval');
  }
 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});