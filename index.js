/* 
 * Primary File for the API
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
/*
  *Testing
  *@Todo Listing
*/

// _data.create('test','newFile',{'foo':'baa'},(err)=>{
//   console.log(`Error is: ${err}`);
// })

// Update File
// _data.update('test','newFile',{'coder':'moder'},(err)=>{
//   console.log(`Error is ${err}`);
// })

// // Read File
// _data.read('test','newFile',(err,data)=>{
//   console.log(`Error is: ${err} and this is data: ${data}`);
// });

// Delete File
// _data.delete('test','newFile',(err)=>{
//   console.log(`Error is: ${err}`);
// });

// The HTTP Server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req,res);  
});

// HTTP Server listen to port
httpServer.listen(config.httpPort, () => {
  console.log(`HTTP Server listening on port ${config.httpPort}  and NodeJs Envoriment is: ${config.name}`);
});

// The HTTPS Server
const httpsOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert':fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer((httpsOptions,req,res)=>{
  unifiedServer(req,res);
});

// HTTPS Server Listen to port
httpsServer.listen(config.httpsPort,()=>{
  console.log(`HTTPS Server is listening on port ${config.httpsPort} and NodeJs envoriment is: ${config.name}`);
});

// Unified Server for both http and https server
const unifiedServer = (req,res)=>{

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
    'payload': helpers.parseJsonToObject(buffer)
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

};


const router = {
  'sample': handlers.sample,
  'users':handlers.users
};