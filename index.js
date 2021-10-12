const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

const unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(`Returning this response | Status code: ${statusCode} | Payload: ${payloadString}`);
    });
  });
};

// helpers.sendTwilioSms('4158375309', 'xablaus123', (err) => {
//   console.log('erro: ', err);
// });

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

var router = {
  'ping': handlers.ping,
  'users': handlers.users,
  'tokens': handlers.tokens,
  'checks': handlers.checks
};