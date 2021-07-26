const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const port = 4000;
const welcomeMessage = 'Hello, human! Good see you!'

const httpServer = http.createServer(function (req, res) {
  let parsedUrl = url.parse(req.url, true);
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');
  let method = req.method.toLowerCase();
  let headers = req.headers;
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });
  req.on('end', function () {
    buffer += decoder.end();
    let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    let data = {
      'trimmedPath': trimmedPath,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    chosenHandler(data, function (statusCode, message) {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      message = typeof (welcomeMessage) == 'object' ? welcomeMessage : { message: welcomeMessage };
      let messageString = JSON.stringify(message);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(messageString);

      console.log(`Returning this response | Status code: ${statusCode} | Payload: ${messageString}`);
    });
  });
});

httpServer.listen(port, function () {
  console.log(`The server is listening on port ${port}`);
});


let handlers = {};

handlers.hello = function (data, callback) {
  callback(200);
};
handlers.notFound = function (data, callback) {
  callback(404);
};

let router = {
  'hello': handlers.hello
};