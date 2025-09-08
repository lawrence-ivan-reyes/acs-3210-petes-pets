if (!process.env.PORT) {
  require('dotenv').config()
  process.env.NODE_ENV = "dev"
}

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon'); // serves the little icon in browser tabs
const logger = require('morgan'); // logs requests to the console
const cookieParser = require('cookie-parser'); // reads cookies from browsers
const bodyParser = require('body-parser'); // reads form data from requests
const methodOverride = require('method-override') // lets forms use PUT and DELETE

const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/petes-pets', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public'))); // serves CSS, JS, and images

// override with POST having ?_method=DELETE or ?_method=PUT
// lets forms use ?_method=PUT or ?_method=DELETE
app.use(methodOverride('_method'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); // shows coloured request logs
app.use(bodyParser.urlencoded({ extended: false })); // reads form data
app.use(bodyParser.json()); // reads JSON data
app.use(cookieParser()); // makes cookies available in code


require('./routes/index.js')(app);
require('./routes/pets.js')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
