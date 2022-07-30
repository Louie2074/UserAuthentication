const { body, validationResult } = require('express-validator');
const async = require('async');
const User = require('../models/user');
const { genPassword, validPassword } = require('../lib/passwordUtils');
const { index } = require('../../InventoryApp/controllers/genre_controller');

exports.register_post = [
  body('username', 'Username incorrect').notEmpty().trim().escape(),
  body('password', 'Password incorrect').notEmpty().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const newUser = new User({
      username: req.body.username,
      hash: genPassword(req.body.password),
      admin: false,
    });

    if (!errors.isEmpty()) {
      res.render('register', {
        title: 'Register',
        errors: errors.array(),
        username: newUser.username,
        msg: '',
      });
    } else {
      User.findOne({ username: newUser.username }).exec((err, user) => {
        if (err) return next(err);

        if (user) {
          res.render('register', {
            title: 'Register',
            errors: errors.array(),
            username: newUser.username,
            msg: 'Looks Like you already have an account, Please sign in',
          });
        } else {
          newUser.save({}, (err) => {
            if (err) return next(err);
            res.redirect('/login');
          });
        }
      });
    }
  },
];

exports.login_get = (req, res, next) => {
  res.render('login', { title: 'Login' });
};
exports.register_get = (req, res, next) => {
  res.render('register', { title: 'Register' });
};

exports.shhh_get = (req, res, next) => {
  res.render('secret', { title: 'Good Job on being cool buddy' });
};

exports.home_get = (req, res, next) => {
  res.render('home', {
    title: 'Welcome to the most secure website on the planet',
  });
};
