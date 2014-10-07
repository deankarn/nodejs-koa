var koa = require('koa'),
    koaBody = require('koa-better-body'),
    csrf = require('koa-csrf'),
    session = require('koa-session-store'),
    mongoose = require('mongoose'),
    mongooseStore = require('koa-session-mongoose'),
    passport = require('koa-passport'),
    jade = require('koa-jade'),
    fs            = require('fs'),
    less = require('less'),
    requirejs = require('requirejs');
    // less = require('koa-lessie'),
    // static    = require('koa-static');
    // requirejs = require('requirejs');

var env = process.env.NODE_ENV || 'development';
var production = env == 'production' ? true : false;
var app = koa();
var port          = process.env.PORT || 3000;
var configDB      = require(__dirname + '/app/config/database.js');
// var lessc = new(less.Parser);
var lessc = new(less.Parser)({
  paths: [__dirname + '/app/less'], // Specify search paths for @import directives
  filename: 'style.less' // Specify a filename, for better error messages
});

// implement some file watching to compile less and copy modified js files to the bundled dir
// also add in coffee compiling and watching of files.



fs.readdir(__dirname + '/app/less', function (err, files){
  files.forEach(function (fn) {
    if(!/\.less$/.test(fn)) return;

        fs.readFile(__dirname + '/app/less/' + fn, 'utf8', function (err,data) {

          if (err) {
            return console.log(err);
          }

            var dataString = data.toString();

            // console.log(dataString);

            lessc.parse(dataString, function (e, tree) {

              var res = tree.toCSS({
                // Minify CSS output
                compress: true
              });

                name = fn.substr(0, fn.lastIndexOf(".")) + ".css";
                //   console.log(res);
                fs.writeFile(__dirname + '/static/bundled/' + name, res, function (err) {
                  if (err) throw err;
                  console.log('Wrote File:' + __dirname + '/static/bundled/' + name);
                });
            });
        //   console.log(data);
        });
  });
});

fs.watch(__dirname + '/app/less', function (event, filename) {
  console.log('event is: ' + event);
  // event change||rename - this was fired on add


  // have to add an if file exits as well
  if (filename) {
    console.log('filename provided: ' + filename);
  } else {
    console.log('filename not provided');
  }
});

fs.readdir(__dirname + '/static/js', function (err, files){
  files.forEach(function (fn) {
    if(!/\.js$/.test(fn)) return;

        if(production)
        {
            fs.readFile(__dirname + '/static/js/' + fn, 'utf8', function (err,data) {

              if (err) {
                return console.log(err);
              }

                var dataString = data.toString();

                name = fn.substr(0, fn.lastIndexOf("."));
                // console.log(dataString);
                var config = {
                    baseUrl: __dirname + '/static/js',
                    name: name,
                    out: __dirname + '/static/bundled/' + fn
                };

                requirejs.optimize(config, function (buildResponse) {
                    //buildResponse is just a text output of the modules
                    //included. Load the built file for the contents.
                    //Use config.out to get the optimized file contents.
                    // var contents = fs.readFileSync(config.out, 'utf8');

                    console.log('Optimized:' + __dirname + '/static/bundled/' + fn);

                }, function(err) {
                    //optimization err callback
                });
            });
        }
        else
        {
            fs.createReadStream(__dirname + '/static/js/' + fn).pipe(fs.createWriteStream(__dirname + '/static/bundled/' + fn));
            console.log('Copied:' + __dirname + '/static/bundled/' + fn);
        }
  });
});


// requirejs.config({
//     //Pass the top-level main.js/index.js require
//     //function to requirejs so that node modules
//     //are loaded relative to the top-level JS file.
//     nodeRequire: require
// });

// app.use(lessie({
//   src: __dirname + '/app/less',
//   dest: __dirname + '/static/bundled',
//   once: production,
//   compress: production,
//   // prefix: 'stylesheets'
// }));
//
// app.use(static(__dirname + '/static/bundled'));

// mongoose.connect(configDB.url); // connect to our database
var db = mongoose.createConnection(configDB.url, { server: { poolSize: 4 }});

app.proxy = true;
app.keys = ['iSwearByMyPrettyFloralBonnetIwillendyou'];  // needed for cookie-signing

//define in require
// app.func = {};
// app.func.isLoggedIn = function* isLoggedIn(next){

//     yield next;
//     // if logged in yield next...otherwise return redirect.
// };

// function* isLoggedIn(next){
//
//     yield next;
//     // if logged in yield next...otherwise return redirect.
// };

csrf(app);

app.on('error', function(err){
  console.log(err);
  // log.error('server error', err);
});

require(__dirname + '/app/config/passport')(mongoose, passport); // pass passport for configuration

app.use(session({
  store: mongooseStore.create({
    collection: 'sessions',
    connection: db,
    expires: 60 * 60 * 24 * 14, // 2 weeks is the default
    // model: 'KoaSession'
  })
}));

// app.use(passport.initialize());
// app.use(passport.session());

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
  }));


// response
app.use(function *root(next){
  if (this.request.method !== 'GET' || this.request.path !== '/') return yield next;

  //yield isLoggedIn(this, next);
  //this.body = 'Hello World';
  // yield this.render('main/login', {
  //               csrf: this.csrf,
  //               title: "Login",
  //               email: "Email",
  //               password: "Password",
  //               forgot: "Forgot Password",
  //               language: "Select Language",
  //           });

    yield this.render('main/test', {
                  csrf: this.csrf,
                  title: "Test Partial Content",
              });
});

app.use(function *partial(next){
  if (this.request.method !== 'GET' || this.request.path !== '/partials/test') return yield next;

  //yield isLoggedIn(this, next);
  //this.body = 'Hello World';
  // yield this.render('main/login', {
  //               csrf: this.csrf,
  //               title: "Login",
  //               email: "Email",
  //               password: "Password",
  //               forgot: "Forgot Password",
  //               language: "Select Language",
  //           });

    yield this.render('partials/test', {
                  csrf: this.csrf,
                  title: "Test Partial Content",
              });
});

app.listen(port);
console.log('running on port ' + port);
