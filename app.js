var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var user = require('./models/user.model');
var music = require('./models/music.model');
var cart = require('./models/cart.model');

//Database
var db = require('mongoose'); 
db.connect('mongodb+srv://memellisa:memellisa05@cluster0.xk7ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err)
    console.log("MongoDB connection error: "+err);
  else
    console.log("Connected to MongoDB"); });
// Set the Schema

var loginRouter = require('./routes/login');
var createRouter = require('./routes/create');
var mainPageRouter = require('./routes/main');
var cartRouter = require('./routes/cart');
var musicRouter = require('./routes/music');
var redirectRouter = require('./routes/redirect');
var checkoutRouter = require('./routes/checkout');
var invoiceRouter = require('./routes/invoice');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session
app.use(session( {secret: "sessionSecret" }));

// Printing session for debugging, delete later
app.use( (req,res,next) => {
  console.log("======SESSION INFO======");
  console.log(req.session);
  next()
});


// Make our model accessible to routers 
app.use((req,res,next) => {
  req.user = user; 
  next();
})

app.use((req,res,next) => {
  req.music = music; 
  next();
})

app.use((req,res,next) => {
  req.cart = cart; 
  next();
})

app.use('/redirect', redirectRouter);
app.use('/invoice', invoiceRouter);
app.use('/checkout', checkoutRouter);
app.use('/login', loginRouter);
app.use('/create', createRouter);
app.use('/cart', cartRouter);
app.use('/music', musicRouter);
app.use('/', mainPageRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
