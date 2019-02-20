const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const express = require('express');
const users = express.Router();

let User = require('../models/User');
let InvalidToken = require('../models/Invalid_token');

users.use(cors());

process.env.SECRET_KEY = 'secret';

let _validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// ACTIONS

// Register
exports.Register = (req, res) => {
  const userData = {
    method: 'local',
    local: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      img_url: req.body.img_url
    }
  };
  if (_validateEmail(req.body.email)) {
    User.findOne({
      'local.email': req.body.email
    })
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash;
            User.create(userData)
              .then(user => {
                res.json({ status: user.local.email + ' Registered !' });
              })
              .catch(err => {
                res.send('error' + err);
              });
          });
        } else {
          res.status(409).json({ error: 'User already exists' });
        }
      })
      .catch(err => {
        res.send('error' + err);
      });
  } else {
    res.status(400).json({ error: 'Email must be of form email@email.net' });
  }
};

exports.Login = (req, res, next) => {
  User.findOne({
    'local.email': req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //Pasword match
          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            wallet: user.wallet
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '3d'
          });
          res.send({ token: token, user: user });
          next();
        } else {
          //pass do not match
          res.status(403).json({ error: 'Wrong password.' });
        }
      } else {
        res.status(400).json({ error: 'User does not exist.' });
      }
    })
    .catch(err => {
      res.send('error' + err);
    });
};

// Logout
exports.Logout = (req, res, next) => {
  // save this token to a mongoDB collection of blacklisted tokens
  // Upon every request, the token passed by the client is checked against these blacklisted tokens
  // If it is in the list, that means the user has logged out at some point, so access should be denied
  const tokenToBlacklist = new InvalidToken({
    token: req.token
  });
  tokenToBlacklist
    .save()
    .then(() => {
      res.json({ status: 'You have successfully logged out!' });
    })
    .catch(err => {
      console.log(err);
    });
};

//LOGIN FB
exports.facebookOAuth = async (req, res, next) => {
  //Generate token
  const payload = {
    id: req._id,
    name: req.name,
    email: req.email,
    password: req.password,
    role: req.role,
    wallet: req.wallet
  };
  let token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '3d'
  });
  res.status(200).json({ token: token });
};

exports.googleOAuth = async (req, res, next) => {
  //Generate token
  const payload = {
    id: req._id,
    name: req.name,
    email: req.email,
    password: req.password,
    role: req.role,
    wallet: req.wallet
  };
  let token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '3d'
  });
  res.status(200).json({ token: token });
};
