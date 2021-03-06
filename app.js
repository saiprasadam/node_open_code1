var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session')
const passport = require("passport");

var coursesRouter = require('./routes/courses');
var usersRouter = require('./routes/users');
var loginRouter = require("./routes/login");
var coursestatusRouter = require("./routes/coursestatus");

var app = express();

const initializePassport = require("./auth/passport");
initializePassport(
  passport, 
  username =>  users.find(user => user.username === username)
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET || 'SESSION_SECRET',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", loginRouter);
app.use('/courses', coursesRouter);
app.use('/users', usersRouter);
app.use('/coursestatus', coursestatusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
