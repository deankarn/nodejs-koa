var koa = require('koa'),
    router = require('koa-router'),
    koaBody = require('koa-better-body'),
    csrf = require('koa-csrf'),
    session = require('koa-session-store'),
    mongoose = require('mongoose'),
    mongooseStore = require('koa-session-mongoose'),
    passport = require('koa-passport'),
    jade = require('koa-jade'),
    fs = require('fs');

var env = process.env.NODE_ENV || 'development';
var production = env == 'production' ? true : false;
var app = koa();
var port = process.env.PORT || 3000;
var configDB = require(__dirname + '/app/config/database.js');
var lessCompiler = require(__dirname + '/app/config/less-compiler.js')(
{
    basedir: __dirname + '/app/less',
    bundledDir: __dirname + '/static/bundled',
    // paths:[__dirname + '/app/less'], // defaults to basedir if not specified
    files: ['style.less'],
    recompileOnChange: !production,
    compress: !production
});

var requirejsCompiler = require(__dirname + '/app/config/requirejs-compiler.js')(
{
    basedir: __dirname + '/static/js',
    bundledDir: __dirname + '/static/bundled',
    compileExcludeModules: ['main'],
    recompileOnChange: !production
});

// mongoose.connect(configDB.url); // connect to our database
var db = mongoose.createConnection(configDB.url,
{
    server:
    {
        poolSize: 4
    }
});

app.proxy = true;
app.keys = ['iSwearByMyPrettyFloralBonnetIwillendyou']; // needed for cookie-signing

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


app.on('error', function(err)
{
    console.log(err);
    // log.error('server error', err);
});

require(__dirname + '/app/config/passport')(mongoose, passport); // pass passport for configuration

app.use(session(
{
    store: mongooseStore.create(
    {
        collection: 'sessions',
        connection: db,
        expires: 60 * 60 * 24 * 14, // 2 weeks is the default
        // model: 'KoaSession'
    })
}));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(jade.middleware(
{
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
app.use(function*(next)
{
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function*(next)
{
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %sms', this.method, this.url, ms);
});

// body parser to be before the routes
app.use(koaBody(
{
    multipart: true,
    // formLimit: 15,
    formidable:
    {
        multiples: true
            // uploadDir: __dirname + '/uploads'
    }
}));

app.use(router(app));

fs.readdir(__dirname + '/app/routes', function (err, files){
  files.forEach(function (fn) {
    if(!/\.js$/.test(fn)) return;
      require(__dirname + '/app/routes/' + fn)(app, passport);
  });
});


app.listen(port);
console.log('running on port ' + port);
