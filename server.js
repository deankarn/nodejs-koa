// Force UTC DateTime to ensure dates are not parsed in the servers locale
// we will do the converting to the users locale
process.env.TZ = 'UTC';

var
	Globalize = require('globalize'),
	koa = require('koa'),
	router = require('koa-router'),
	koaBody = require('koa-better-body'),
	csrf = require('koa-csrf'),
	session = require('koa-session-store'),
	mongoose = require('mongoose'),
	mongooseStore = require('koa-session-mongoose'),
	passport = require('koa-passport'),
	jade = require('koa-jade'),
	fs = require('fs'),
	wrench = require('wrench');

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
	compress: production
});

var requirejsCompiler = require(__dirname + '/app/config/requirejs-compiler.js')(
{
	basedir: __dirname + '/static/js',
	bundledDir: __dirname + '/static/bundled',
	compileExcludeModules: ['main'],
	recompileOnChange: !production
});

// Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
Globalize.load(require(__dirname + '/cldr/main/en-GB/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/en-GB/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/en/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/en/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/fr/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/fr/numbers.json'));
Globalize.load(require(__dirname + '/cldr/main/zh-Hant/ca-gregorian.json'));
Globalize.load(require(__dirname + '/cldr/main/zh-Hant/numbers.json'));
Globalize.load(require(__dirname + '/cldr/supplemental/likelySubtags.json'));
Globalize.load(require(__dirname + '/cldr/supplemental/timeData.json'));
Globalize.load(require(__dirname + '/cldr/supplemental/weekData.json'));

// Load all translations in the /app/translations/ directory
wrench.readdirRecursive(__dirname + '/app/translations', function (err, files){

	if(!files) return;

	files.forEach(function (fn)
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
models.forEach(function (filename)
{
	if (!/\.js$/.test(filename)) return;

	console.log("loading model:" + filename + '...');
	require(__dirname + '/app/models/' + filename);
});

fs.readdir(__dirname + '/app/models', function (err, files)
{
	console.log('models');
	// console.log(files);
	files.forEach(function (filename)
	{
		if (!/\.js$/.test(filename)) return;
		require(__dirname + '/app/models/' + filename);
	});
});

mongoose.connect(configDB.url); // connect to our database

app.proxy = true;
app.keys = ['iSwearByMyPrettyFloralBonnetIwillendyou']; // needed for cookie-signing

csrf(app);


app.on('error', function (err)
{
	console.log(err);
	// log.error('server error', err);
});

app.use(function* (next)
{
	var start = new Date;
	yield next;
	var ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function* (next)
{
	var start = new Date;
	yield next;
	var ms = new Date - start;
	console.log('%s %s - %sms', this.method, this.url, ms);
});

// body parser to be before the routes
app.use(koaBody(
{
	fieldsKey: false,
	multipart: true,
	// formLimit: 20,
	formidable:
	{
		maxFields: 20,
		multiples: true
			// uploadDir: __dirname + '/uploads' OS Temp Dir by default
	}
}));

require(__dirname + '/app/config/passport');

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
}));

// app.use(function* (next)
// {
// 	console.log(this.request.url);
// 	// console.log('query params:' + this.request.query.tst);
// 	// if(!this.request.query.tst)
// 	// 	console.log('not set');
//
// 	yield next;
// });

var public = new router();
var secured = new router();

var localeMidgard = require(__dirname + '/app/middleware/locale.js')(Globalize, public);

// this should be done, right before getting to any route, no sooner.
app.use(localeMidgard);

// require(__dirname + '/app/routes/public/public.js')(public, secured);
wrench.readdirRecursive(__dirname + '/app/routes/public', function (err, files){

	if(!files) return;

	files.forEach(function (fn)
	{
		// console.log(fn);
		if (!/\.js$/.test(fn)) return;
		require(__dirname + '/app/routes/public/' + fn)(public, secured);
	});
});

app.use(public.middleware())

// Require authentication for now
app.use(function* ensureAuthenticated(next)
{
	if (this.isAuthenticated())
	{
		yield next
	}
	else
	{
		// use router get url instead of hard coding
		this.redirect(public.url('login'))
	}
});

wrench.readdirRecursive(__dirname + '/app/routes/secured', function (err, files){

	if(!files) return;

	files.forEach(function (fn)
	{
		// console.log(fn);
		if (!/\.js$/.test(fn)) return;
		require(__dirname + '/app/routes/secured/' + fn)(public, secured);
	});
});

// fs.readdir(__dirname + '/app/routes', function (err, files)
// {
// 	files.forEach(function (fn)
// 	{
// 		if (!/\.js$/.test(fn)) return;
// 		require(__dirname + '/app/routes/' + fn)(public, secured);
// 	});
// });

app.use(secured.middleware())


app.listen(port);
console.log('running on port ' + port);
