const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { validPassword } = require('../lib/passwordUtils');
const cb = (username, password, done) => {
  User.findOne({ username: username }).exec((err, user) => {
    if (err) return done(err);
    if (!user)
      return done(null, false, { msg: 'User doesnt exist' });
    const isValid = validPassword(password, user.hash, user.salt);
    if (isValid) return done(null, user);
    else return done(null, false, { msg: 'Incorrect Credentials' });
  });
};

const strategy = new LocalStrategy({}, cb);

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
