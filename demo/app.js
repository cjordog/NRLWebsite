var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var os = require('os');
var pty = require('node-pty');
var dotenv = require('dotenv');
var session = require ('express-session');




var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var Author = require(__dirname + '/reservation')
var async = require('async')
var reservation_controller = require(__dirname + '/reservationController');
var user = null;


//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://user:password@ds133311.mlab.com:33311/cs199website';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator() ); // Add this after the bodyParser middleware!
app.use(cookieParser());

dotenv.load();

var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL || 'http://localhost:8000/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

//configure session
app.use(session({
  secret: 'testing12345',
  resave: false,
  saveUninitialized: false
  /*store: sessionStore,*/
  /*cookie: {
    maxAge: 14 * 24 *60 * 60 * 1000,
    httpOnly: true
  }*/
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
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

var terminals = {},
    logs = {};

app.use('/build', express.static(__dirname + '/../build'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/terminal_admin', function(req, res){
  if(req.session.user && (req.session.user._json.email=='martinckong24@gmail.com' || req.session.user._json.email=='cjordog@gmail.com')){
    console.log('Email: ' + req.session.user._json.email);
    console.log('Verified: ' + req.session.user._json.email_verified);
    //res.sendFile(__dirname + '/terminal.html');
    res.render(__dirname + '/terminal.pug', {username: req.session.user._json.email});
  }
  else{
    res.redirect('/login');
  }
});

/*app.get('/catalog', function(req, res){
    res.sendFile(__dirname + '/catalog.html');
});*/


app.get('/FAQ', function(req, res){
  res.sendFile(__dirname + '/FAQ.html');
});

app.get('/register', function(req, res){
  res.sendFile(__dirname + '/register.html');
});

app.get('/search', function(req, res){
  res.sendFile(__dirname + '/search.html');
});

app.get('/publications', function(req, res){
  res.sendFile(__dirname + '/publications.html');
});

app.get('/map', function(req, res){
  res.sendFile(__dirname + '/map.html');
});

app.get('/searchwithmap', function(req, res){
  res.sendFile(__dirname + '/searchwithmap.html');
});


app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/style.css');
});

app.get('/bootstrap.css', function(req, res){
  res.sendFile(__dirname + '/stylesheets/bootstrap.min.css');
});

app.get('/bootstrap.js', function(req, res){
  res.sendFile(__dirname + '/javascripts/bootstrap.min.js');
});

app.get('/main.js', function(req, res){
  res.sendFile(__dirname + '/main.js');
});


app.get('/img1', function(req, res){
  res.sendFile(__dirname + '/images/IMG_1650.JPG');
});

app.get('/img2', function(req, res){
  res.sendFile(__dirname + '/images/IMG_1664.JPG');
});

app.get('/img3', function(req, res){
  res.sendFile(__dirname + '/images/IMG_1670.JPG');
});

app.get('/error', function(req, res){
  res.render(__dirname + '/error.pug');
});

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

/*app.get('/reservations', function(req, res, next){
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('author_list', { title: 'Reservation List', author_list:  list_authors});
    })
});*/
/*exports.reservation_list = function(req, res, next) {

  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('author_list', { title: 'Reservation List', author_list:  list_authors});
    })

};*/


/*app.get('/catalog', function(req, res){
    res.render(__dirname + '/index.pug');
});*/

app.get('/terminal', reservation_controller.terminal_time);

app.get('/catalog', reservation_controller.index);

/* GET request for creating Author. NOTE This must come before route for id (ie display author)*/
app.get('/reservation/create', reservation_controller.reservation_create_get);

/* POST request for creating Author. */
app.post('/reservation/create', reservation_controller.reservation_create_post);

/* GET request to delete Author. */
app.get('/reservation/:id/delete', reservation_controller.reservation_delete_get);

// POST request to delete Author
app.post('/reservation/:id/delete', reservation_controller.reservation_delete_post);
app.get('/request/:id/delete', reservation_controller.request_delete_get);
app.post('/request/:id/delete', reservation_controller.request_delete_post);
app.get('/request/:id/approve', reservation_controller.request_approve);

/* GET request for one Author. */
app.get('/reservation/:id', reservation_controller.reservation_detail);
app.get('/request/:id', reservation_controller.request_detail);

/* GET request for list of all Authors. */
app.get('/reservations', reservation_controller.reservation_list);
app.get('/requests', reservation_controller.request_list);
app.get('/my_requests', reservation_controller.my_request_list);


app.post('/terminals', function (req, res) {
  var cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: 'xterm-color',
        cols: cols || 80,
        rows: rows || 24,
        cwd: process.env.PWD,
        env: process.env
      });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function(data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

app.post('/terminals/:pid/size', function (req, res) {
  var pid = parseInt(req.params.pid),
      cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = terminals[pid];

  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});

app.ws('/terminals/:pid', function (ws, req) {
  var term = terminals[parseInt(req.params.pid)];
  console.log('Connected to terminal ' + term.pid);
  ws.send(logs[term.pid]);

  term.on('data', function(data) {
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function(msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

app.get('/login',function(req, res){
    res.render(__dirname + '/login.pug', { env: process.env });
});

// Perform session logout and redirect to homepage
app.get('/logout', function(req, res){
  exports.User = null;
  req.session.destroy(function(){
      res.redirect('/');
    });
});

// Perform the final stage of authentication and redirect to '/user'
app.get('/callback',
passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
function(req, res) {
  if(!req.user){
    throw new Error('user null');
  }

  req.session.user = req.user;
  user = req.user;
  exports.User = req.user;
  res.redirect(/*req.session.returnTo ||*/ '/terminal');
});

app.get('/calendar', function(req, res, next) {
  if(req.session.user){
    res.render(__dirname + '/calendar.pug');
  }
  else{
    res.redirect('/login');
  }
});


var port = process.env.PORT || 80,
//    host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';
    host = 'apus.cs.ucla.edu';
console.log('App listening to http://' + host + ':' + port);
app.listen(port, host);
