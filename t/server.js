var compression = require('compression');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connection = require('./config/connection');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var session = require('cookie-session');
// var mysql = require('mysql');

var app = express();

// pool = mysql.createPool({
//       connectionLimit: 10,
//       host: 'localhost',
// 	    port: '8889',
//       user: 'root',
//       password: 'root',
//       database: 'hra'
//     });

app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/beneficiary',express.static(path.join(__dirname, 'public')));
app.use('/modelhouse',express.static(path.join(__dirname, 'public')));
app.use('/modelhouses',express.static(path.join(__dirname, 'public')));
app.use('/users',express.static(path.join(__dirname, 'public')));
app.use('/hc-financials',express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));


//app.use(logger('dev'));
//app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '3000mb', extended: true }));
app.use(bodyParser.json({limit: '3000mb'}));
app.use(cookieParser());

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
app.get("/c",(req,res)=>{
res.end("its working");
})
// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

// required for passport
// Initialize Passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotchHRA',
  //cookie: { expires: new Date(253402300000000)},
  cookie: { maxAge: 600000},
  saveUninitialized: false,
  resave: false,
  signed: true
  })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use('/', require('./routes'));
var lookups = require('./routes/lookups');
var users = require('./routes/users');
var beneficiary = require('./routes/beneficiary');
var hc_financials = require('./routes/hc-financials');
app.use('/lookups', lookups);
app.use('/users', users);
app.use('/beneficiary', beneficiary);
app.use('/hc-financials', hc_financials);
connection.init();

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  // next(err);
  res.status(err.status || 500);
  res.render('pages/page_not_found', {
    message: err.message,
    err: {}
  });
});

// Start the server
app.set('port', 80);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
