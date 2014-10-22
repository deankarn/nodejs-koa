var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var User = require('mongoose').model('User');
var co = require('co');

passport.serializeUser(function (user, done)
{
	done(null, user._id)
});

passport.deserializeUser(function (id, done)
{
	console.log('deserializing user');
	User.findById(id, done);
});

passport.use('local-login', new LocalStrategy(
	{
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
	function (req, email, password, done)
	{
		co(function* ()
		{
			try
			{
				var user =
					yield User.findOne(
					{
						'local.email': email
					})
					.exec();

				if (!user) throw new Error('Username or Passowrd is incorrect.');

				var valid =
					yield user.validPassword(password);

				if (valid)
				{
					// ctx.session.localeString = ctx.request.user.locale;
					// ctx.session.utcOffset = ctx.request.body['utc-offset'];
					// console.log('valid');
					// console.log('UTC:' + req.body['utc-offset']);

					req.session.localeString = user.locale;
					req.session.utcOffset = req.body['utc-offset'];

					return user;
				}

				// password does not match, but don't want to say that.
				throw new Error('Username or Passowrd is incorrect.');
			}
			catch (ex)
			{
				console.log('Error:' + ex)
				return null;
			}
		})(done);
	}));

passport.use('local-signup', new LocalStrategy(
	{
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
	function (req, email, password, done)
	{

		// // asynchronous
		// // User.findOne wont fire unless data is sent back
		// process.nextTick(function() {
		//
		// // find a user whose email is the same as the forms email
		// // we are checking to see if the user trying to login already exists
		// User.findOne({ 'local.email' :  email }, function(err, user) {
		//     // if there are any errors, return the error
		//     if (err)
		//         return done(err);
		//
		//     // check to see if theres already a user with that email
		//     if (user) {
		//         return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
		//     } else {
		//
		//         // if there is no user with that email
		//         // create the user
		//         var newUser            = new User();
		//
		//         // set the user's local credentials
		//         newUser.local.email    = email;
		//         newUser.local.password = newUser.generateHash(password);
		//         newUser.locale         = req.localeString;
		//
		//         // save the user
		//         newUser.save(function(err) {
		//             if (err)
		//                 throw err;
		//
		//             //req.session.localeString = user.localeString;
		//
		//             return done(null, newUser);
		//         });
		//     }
		//
		// });

		// });

	}));

// var FacebookStrategy = require('passport-facebook').Strategy
// passport.use(new FacebookStrategy(
//     {
//         clientID: 'your-client-id',
//         clientSecret: 'your-secret',
//         callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
//     },
//     function(token, tokenSecret, profile, done)
//     {
//         // retrieve user ...
//         done(null, user)
//     }
// ))
//
// var TwitterStrategy = require('passport-twitter').Strategy
// passport.use(new TwitterStrategy(
//     {
//         consumerKey: 'your-consumer-key',
//         consumerSecret: 'your-secret',
//         callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
//     },
//     function(token, tokenSecret, profile, done)
//     {
//         // retrieve user ...
//         done(null, user)
//     }
// ))
//
// var GoogleStrategy = require('passport-google').Strategy
// passport.use(new GoogleStrategy(
//     {
//         returnURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback',
//         realm: 'http://localhost:' + (process.env.PORT || 3000)
//     },
//     function(identifier, profile, done)
//     {
//         // retrieve user ...
//         done(null, user)
//     }
// ))
