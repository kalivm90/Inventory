// TODO, SAVE DB ITS READY, test that navbar loads categories, test images on index and finish

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();

// PRODUCTION
// compresses http response for perforance
const compression = require("compression")
// protect against common vulnerabilities 
const helmet = require("helmet");


// DB
const mongoose = require("mongoose");
// custom middleware
const navLinkMiddleware = require("./middleware/navLinks");

const indexRouter = require('./routes/index');
const catalogRouter = require("./routes/catalog");
const aboutRouter = require("./routes/about");

const app = express();

// Set up rate limiter: maximum of forty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()) // compress https response
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "cdn.jsdelivr.net"],
    }
  })
); // protect against common vulnerabilities 
app.use(limiter); // Apply rate limiter to all requests
app.use(express.static(path.join(__dirname, '../public')));

// custom middleware to populate categories dropdown in layout.pug
app.use(navLinkMiddleware)

app.use('/', indexRouter);
app.use("/catalog", catalogRouter);
app.use("/about", aboutRouter);

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

// DB 

const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = app;
