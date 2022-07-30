var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const MongoStore = require('connect-mongo');
var indexRouter = require('./routes/index');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

var app = express();
const mongoDB = process.env.MONGO_URI;
const clientP = mongoose
  .connect(mongoDB, {
    dbName: 'Users',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((m) => m.connection.getClient());
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      dbName: 'Users',
      clientPromise: clientP,
      autoRemove: 'interval',
      autoRemoveInterval: 1,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
