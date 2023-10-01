const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const respond = (request, response, status, content, type) => {
  response.writeHead(status, `'Content-Type': ${type}`);

  if (type === 'text/html' || type === 'text/css') {
    response.write(content);
  } else {
    response.write(JSON.stringify(content));
  }
  response.end();
};

const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

const getCSS = (request, response) => respond(request, response, 200, css, 'text/css');

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };
  if (!body.name || !body.age) {
    responseJSON.id = 'addUserMissingParams';
    return respond(request, response, 400, responseJSON, 'application/json');
  }
  if (!users[body.name]) {
    responseJSON.message = 'Created Successfully';
    users[body.name] = {
      name: body.name,
      age: body.age,
    };
    return respond(request, response, 201, responseJSON, 'application/json');
  } if (users[body.name]) {
    responseJSON.message = 'Updated Successfully';
    users[body.name].age = body.age;
    return respond(request, response, 204, responseJSON, 'application/json');
  }
  return respond(request, response, 400, responseJSON, 'application/json');
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found.',
  };
  return respond(request, response, 404, responseJSON, 'application/json');
};

const getUsers = (request, response) => respond(request, response, 200, users, 'application/json');

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found.',
  };
  return respond(request, response, 404, responseJSON, 'application/json');
};

module.exports = {
  getIndex,
  getCSS,
  notFound,
  addUser,
  getUsers,
  notReal,
};
