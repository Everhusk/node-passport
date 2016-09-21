// Dependencies
var app = require('express')();
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./config');

// App Configuration
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Setup view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(flash());
// Setup Passport
app.use(session({secret:config.secret,resave:true,saveUnitialized:true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./models/passport')(passport);
// Setup MongoDb
var mongoose = require('mongoose');
mongoose.connect(config.mongoURL);
mongoose.connection.on('connected', () => {console.log('MongoDB connection established!')});
mongoose.connection.on('error', () => {console.log('MongoDB connection error. Please make sure MongoDB is running.');process.exit();});

// Controllers (route handlers)
UserController = require('./controllers/UserController');
ViewController = require('./controllers/ViewController');

// Public Routes
app.get('/', ViewController.index);
app.post('/login', UserController.login(passport));
app.post('/signup', UserController.signup(passport));
app.get('/logout', UserController.logout);
// Authenticated Routes
app.get('/dashboard',authenticate,ViewController.dashboard);
app.post('/contact/add', authenticate, UserController.addContact);
app.post('/contact/edit', authenticate, UserController.editContact);
app.post('/contact/delete', authenticate, UserController.deleteContact);

// Catch 404
app.use(function(req, res, next) {
  res.render('error.ejs', {
    message: "Page not found",
    error: 404
  });
});

// Start the server
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

// Authentication Middleware
function authenticate(req, res, next) {
  // if user is authenticated in the session, carry on
  console.log("Authenticated",req.isAuthenticated());
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}
