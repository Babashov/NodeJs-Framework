/* 
 * Primary File for the API
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with string
const server = http.createServer((req, res) => {

  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimPath = path.replace(/^\/+|\/+$/g, '');

  // Get query string object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get Request Headers
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data) => {

    buffer += decoder.write(data);

  });
  req.on('end', () => {

    buffer += decoder.end();

    // Choose handler from router object. If not found any router select the @notFound Router
    const chosenRouter = typeof (router[trimPath]) !== 'undefined' ? router[trimPath] : handlers.notFound;

    // Sending all request information data to route
    const data = {
      trimPath,
      queryStringObject,
      method,
      headers,
      'payload': buffer
    };
    chosenRouter(data, (statusCode, payload) => {
      // Check the header status code
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
      // Check the payload if need or no
      payload = typeof (payload) === 'object' ? payload : {};
      // Convert Payload to String
      const payloadString = JSON.stringify(payload);
      // Return Response
      res.setHeader('Content-type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      // Log the request path
      console.log(`Request is: ${trimPath} and HTTP method is ${method} and query string object is: ${JSON.stringify(queryStringObject)} and Request Header is: ${JSON.stringify(headers)} and Request is recieaved: ${buffer}`);
    });

  });

});

// Server listen to port
server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}  and NodeJs Envoriment is: ${config.envName}`);
});

// Handler Object for handle routings
const handlers = {};

// Sample Route Handler
handlers.sample = (data, callback) => {
  // Callback return http status code, and payload object
  callback(406, {
    'name': 'Sample Router Handler'
  });

};

// 404 Not Found Handler
handlers.notFound = (data, callback) => {
  // 404 Page Not Found Callback only return http status code
  callback(404);

};


const router = {
  'sample': handlers.sample
};