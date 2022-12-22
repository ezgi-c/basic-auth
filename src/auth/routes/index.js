const express = require('express');
const base64 = require('base-64');
const { User } = require('../models');

const authRoutes = express();

// Make a POST request to the/signup route with username and password.
authRoutes.post('/signup', signup);
// Make a POST request to the /signin route.
// authRoutes.post('/signin', signin);

async function signup(req, res, next) {
  // On a successful account creation, return a 201 status with the user object in the body.
  // On any error, trigger your error handler with an appropriate error.
  const { username, password } = req.body;

  // create basic auth header:
  // let authorization = `${username}:${password}`;
  // let encoded_authorization = "Basic " + base64.encode(authorization);
  // console.log('ENCODED AUTHORIZATION',encoded_authorization);

  let user = await User.createWithHashed(username, password);
  if (user) {
    res.status(201).json(user);
  } else {
    next(new Error('Unsuccessful account creation request.'));
  }
}

// Send a basic authentication header with a properly encoded username and password combination.
// On a successful account login, return a 200 status with the user object in the body.
// On any error, trigger your error handler with the message “Invalid Login”.
authRoutes.post('/signin', async function signin(req, res, next) {
  let authorization = req.header('Authorization');
  if (!authorization.startsWith('Basic ')) {
    console.log('auth does not start with basic');
    next(new Error('Invalid authorization scheme'));
    return;
  }
  console.log(typeof authorization);

  authorization = base64.decode(authorization.replace('Basic ', ''));

  console.log('Basic authorization request', authorization);

  const [username, password] = authorization.split(':');
  let user = await User.findLoggedIn(username, password);
  if (user) {
    res.status(200).send({ username: user.username });
  } else {
    next(new Error('Invalid login'));
  }
});

module.exports = { authRoutes };
