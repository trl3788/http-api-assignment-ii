const http = require('http');
const url = require('url');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const responseHandler = require('./responses.js');

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/addUser': responseHandler.addUser,
  '/getUsers': responseHandler.getUsers,
  '/notReal': responseHandler.notReal,
  notFound: responseHandler.notFound,
};

const parseBody = (request, response, callback) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    callback(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addUser') {
    parseBody(request, response, responseHandler.addUser);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else if (urlStruct[parsedURL.pathname]) {
    urlStruct[parsedURL.pathname](request, response, parsedURL);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
