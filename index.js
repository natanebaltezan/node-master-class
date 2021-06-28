const http = require('http');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');

const server = http.createServer(function (req, res) {

  // Get the URL and parse it
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // HTTP method is one of the objects available on the req object
  let method = req.method.toLowerCase();

  // Get the header as an object
  let headers = req.headers;

  // Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });
  req.on('end', function () {
    buffer += decoder.end();

    // Choose the handler this request should go
    let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler or default to 200
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      // Use thepayload called back by the handler or default to an empty object
      payload = typeof (payload) == 'object' ? payload : {};

      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request
      console.log(`Returning this response | Status code: ${statusCode} | Payload: ${payloadString}`);
    });
  });
});

server.listen(config.port, function () {
  console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
});

// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
  // callback a htttp status code and a payload object
  callback(406, { 'name': 'sample handler' });
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define a request router
let router = {
  'sample': handlers.sample
};