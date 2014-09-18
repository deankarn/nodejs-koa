var koa = require('koa');
var session = require('koa-session-store');
var mongoose = require('mongoose');
var mongooseStore = require('koa-session-mongoose');
var jade = require('koa-jade');

var app = koa();
var port          = process.env.PORT || 3000;
var configDB      = require(__dirname + '/app/config/database.js');

// mongoose.connect(configDB.url); // connect to our database
var mongooseConnection = mongoose.createConnection(configDB.url, { server: { poolSize: 4 }});

app.proxy = true;
app.keys = ['iSwearByMyPrettyFloralBonnetIwillendyou'];  // needed for cookie-signing

app.on('error', function(err){
  console.log(err);
  // log.error('server error', err);
});

// app.use(session({
//     secret: 'iSwearByMyPrettyFloralBonnetIwillendyou!',
//     proxy: true,
//     //rolling: true,
//     unset: 'destroy',
//     saveUninitialized: true,
//     resave: true,
//     cookie: {
//       httpOnly: false,
//       secure: false, // needs set to true when https
//       //maxAge: null // use with single page app websockets, that I'm going to test
//       maxAge: 60 * 60 * 1000 // use with http requests, or the way I'm going to
//     },
//     store: new MongoStore({
//       collection: 'sessions', // table/collection name for sessions default is sessions
//       auto_reconnect: true,
//       url: configDB.url + '/sessions',
//       clear_interval: 60 * 60 * 1000 // disabled, gets cleaned up 
//     })
//   }));

app.use(session({
  store: mongooseStore.create({
    collection: 'sessions',
    connection: mongooseConnection,
    expires: 60 * 60 * 24 * 14, // 2 weeks is the default
    // model: 'KoaSession'
  })
}));

// app.locals.basedir = __dirname + '/views';

// app.use(function *(next) {
//   this.locals = {
//   	basedir: __dirname + '/views'
//     // session: this.session,
//     // title: 'app'
//   };

//   yield next;
// });

app.use(jade.middleware({
  viewPath: __dirname + '/views',
  debug: false,
  pretty: false,
  compileDebug: false,
  basedir: __dirname + '/views'
  // locals: {basedir: __dirname + '/views'},
  // helperPath: [
  //   'path/to/jade/helpers',
  //   { random: 'path/to/lib.js' },
  //   { _: require('lodash') }
  // ]
}));


// x-response-time

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %sms', this.method, this.url, ms);
});

// response

app.use(function *(){
  //this.body = 'Hello World';
  yield this.render('main/login', { 
                title: "Login", 
                email: "Email", 
                password: "Password", 
                forgot: "Forgot Password", 
                language: "Select Language",
            }, true)
});

app.listen(port);
console.log('running on port ' + port);