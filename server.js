process.env.TZ = 'UTC';

var
    Globalize = require('globalize'),
    koa = require('koa'),
    router = require('koa-router'),
    koaBody = require('koa-better-body'),
    csrf = require('koa-csrf'),
    session = require('koa-session-store'),
    mongoose = require('mongoose'),
    // mongo = require('koa-mongo'),
    // mongoStore = require('koa-session-mongo'),
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

// Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
//Globalize.load(require( __dirname + '/cldr/main/en-CA/ca-gregorian.json'));
//Globalize.load(require( __dirname + '/cldr/main/en-CA/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/en-GB/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/en-GB/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/en/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/en/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/fr/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/fr/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/zh-Hant/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/zh-Hant/numbers.json'));
//Globalize.load(require( __dirname + '/cldr/main/en/ca-gregorian.json'));
//Globalize.load(require( __dirname + '/cldr/main/en/numbers.json'));
Globalize.load(require(__dirname + '/cldr/supplemental/likelySubtags.json'));
Globalize.load(require(__dirname + '/cldr/supplemental/timeData.json'));
Globalize.load(require(__dirname + '/cldr/supplemental/weekData.json'));

// Load all translations in the /app/translations/ directory

fs.readdir(__dirname + '/app/translations', function(err, files)
{
    files.forEach(function(fn)
    {
        if (!/\.json$/.test(fn)) return;
        Globalize.loadTranslations(require(__dirname + '/app/translations/' + fn));
    });
});

// Set "en" as our default locale.
Globalize.locale('en-GB');
//
// var localeMidgard = require(__dirname + '/app/middleware/locale.js')(Globalize);

var models = fs.readdirSync(__dirname + '/app/models');
models.forEach(function(filename)
{
    if (!/\.js$/.test(filename)) return;

    console.log("loading model:" + filename + '...');
    require(__dirname + '/app/models/' + filename);
});
fs.readdir(__dirname + '/app/models', function(err, files)
{
    console.log('models');
    // console.log(files);
    files.forEach(function(filename)
    {
        console.log("model:" + filename);
        if (!/\.js$/.test(filename)) return;
        require(__dirname + '/app/models/' + filename);
    });
});

mongoose.connect(configDB.url); // connect to our database
// console.log(db);
// var db = mongoose.createConnection(configDB.url,
// {
//     server:
//     {
//         poolSize: 4
//     }
// });

// app.use(mongo({
//   uri: configDB.url,
//   max: 100,
//   min: 1,
//   timeout: 30000,
//   log: false
// }));

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

// app.use(function*(next){
//     console.log('setting request mongo object');
//     this.request.mongo = this.mongo; yield next;});

// body parser to be before the routes
app.use(koaBody(
{
    fieldsKey: false,
    // filesKey:'_files',
    multipart: true,
    // formLimit: 15,
    formidable:
    {
        maxFields: 20,
        multiples: true
            // uploadDir: __dirname + '/uploads'
    }
}));

// app.use(function*(next)
// {
//     // if there are fields from better-body-parser but not files aka json or url form encoded
//     if(this.request.body.fields && !this.request.body.files){
//         var body = this.request.body.fields;
//         this.request.body = body;
//     }
//
//     // if(this.request.body.fields || this.request.body.files){
//     //
//     //     var body = {};
//     //
//     //     if(this.request.body.fields)
//     //     {
//     //         var fields = this.request.body.fields;
//     //         body = fields;
//     //     }
//     //
//     //     if(this.request.body.files)
//     //     {
//     //         var fields = this.request.body.fields;
//     //         body.fields = fields;
//     //     }
//     //
//     //     this.request.body = body;
//     // }
//
//     yield next;
// });
// var bodyParser = require('koa-bodyparser');
// app.use(bodyParser());
// app.use(koaBody());

// require(__dirname + '/app/config/passport')(mongoose, passport); // pass passport for configuration

require(__dirname + '/app/config/passport')(configDB);

// app.use(session({
//   store: mongoStore.create({
//           url: configDB.url
//         })
// }));
app.use(session(
{
    store: mongooseStore.create(
    {
        collection: 'sessions',
        // connection: db,
        expires: 60 * 60 * 24 * 14, // 2 weeks is the default
        // model: 'KoaSession'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

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


// var User = require('mongoose').model('User');
// // var User = db.model('User');
// // x-response-time
// app.use(function* (next) {
//   // this.mongo.collection('users').findOne({}, function (err, doc) {
//   //   console.log(doc);
//   // });
//
//   console.log('finding');
//   var user = yield User.findOne({'local.email': 'Dean.Karn@gmail.com'}).exec();
//   // var user = yield User.find({}).exec();
//
//   console.log('user:' + user);
//
//   // this.mongo.collection('test').insert({name:'test', dt1:new Date()}, function(err, doc){
//   //    console.log(err);
//   //    console.log(doc);
//   // });
// });

// app.use(router(app));
var public = new router();
var secured = new router();

require(__dirname + '/app/routes/public/public.js')(public, secured);

app.use(public.middleware())

// Require authentication for now
app.use(function* ensureAuthenticated(next)
{
    // console.log('in ensureAuthenticated');
    if (this.isAuthenticated())
    {
        yield next
    }
    else
    {
        // console.log('redirecting:' + public.url('login'));
        // use router get url instead of hard coding
        this.redirect(public.url('login'))
    }
});

fs.readdir(__dirname + '/app/routes', function(err, files)
{
    files.forEach(function(fn)
    {
        if (!/\.js$/.test(fn)) return;
        require(__dirname + '/app/routes/' + fn)(public, secured);
    });
});

app.use(secured.middleware())


app.listen(port);
console.log('running on port ' + port);
