var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const { isAuth, isAdmin } = require('../lib/Authorizations');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login');
});
router.get('/login', userController.login_get);
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render('login', { title: 'Login', msg: info.msg });
    } else {
      req.logIn(user, function (err) {
        //this is crucial

        if (err) {
          return next(err);
        }

        res.render('login-success', { title: 'You have been Authorized' });
      });
    }
  })(req, res, next);
});
router.get('/shhh', isAdmin, userController.shhh_get);
router.get('/home', isAuth, userController.home_get);
router.get('/register', userController.register_get);
router.post('/register', userController.register_post);
router.get('/logout', function (req, res) {
  req.session.destroy(function () {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
