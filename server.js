var koa = require('koa'),
    koaBody = require('koa-better-body'),
    csrf = require('koa-csrf'),
    session = require('koa-session-store'),
    mongoose = require('mongoose'),
    mongooseStore = require('koa-session-mongoose'),
    jade = require('koa-jade'),
    fs            = require('fs');

var env = process.env.NODE_ENV || 'development';
var production = env == 'production' ? true : false;
var app = koa();
var port          = process.env.PORT || 3000;
var configDB      = require(__dirname + '/app/config/database.js');

// mongoose.connect(configDB.url); // connect to our database
var mongooseConnection = mongoose.createConnection(configDB.url, { server: { poolSize: 4 }});

app.proxy = true;
app.keys = ['iSwearByMyPrettyFloralBonnetIwillendyou'];  // needed for cookie-signing

csrf(app);

app.on('error', function(err){
  console.log(err);
  // log.error('server error', err);
});

app.use(session({
  store: mongooseStore.create({
    collection: 'sessions',
    connection: mongooseConnection,
    expires: 60 * 60 * 24 * 14, // 2 weeks is the default
    // model: 'KoaSession'
  })
}));

app.use(jade.middleware({
  viewPath: __dirname + '/views',
  debug: !production,
  pretty: !production,
  compileDebug: !production,
  noCache: !production, // should be set true|false based on development vs production mode.
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

// body parser to be before the routes
app.use(koaBody({
    multipart: true,
    // formLimit: 15,
    formidable: {
      multiples: true
      // uploadDir: __dirname + '/uploads'
    }
  }))

// response
app.use(function *(){
  if (this.request.method !== 'GET' || this.request.path !== '/') return yield next;
  //this.body = 'Hello World';
  yield this.render('main/login', {
                csrf: this.csrf,
                title: "Login", 
                email: "Email", 
                password: "Password", 
                forgot: "Forgot Password", 
                language: "Select Language",
            });
});

app.listen(port);
console.log('running on port ' + port);