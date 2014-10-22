module.exports = function(configDB)
{
    var passport = require('koa-passport');
    var bcrypt = require('bcrypt');
    var LocalStrategy = require('passport-local').Strategy;
    // var MongoClient = require('mongodb').MongoClient;
    var User = require('mongoose').model('User');
    var co = require('co');

    // var user = {
    //     id: 1,
    //     email: 'test@gmail.com'
    // };

    passport.serializeUser(function(user, done)
    {
        done(null, user._id)
    });

    passport.deserializeUser(function(id, done)
    {
        console.log('deserializing user');
        User.findById(id, done);
        // User.findOne({'_id':id})
        // console.log(id);
        //
        // MongoClient.connect(configDB.url, function(err, db)
        // {
        //     console.log(err);
        //     // assert.equal(null, err);
        //     // console.log("Connected correctly to server");
        //     var collection = db.collection('users');
        //
        //     collection.find(
        //     {
        //
        //     }).toArray(function(err, users)
        //     {
        //         db.close();
        //         console.log(users[0]);
        //         var user = users[0];
        //
        //         done(null, user);
        //     });
        //
        //     // db.close();
        // });
        // console.log(id);
        // console.log(req);
        // req.mongo.collection('users').findOne(
        // {
        //     '_id': id
        // }, function(err, user)
        // {
        //     console.log('User:' + user);
        //
        //     // if there are any errors, return the error before anything else
        //     // if (err)
        //     //     return done(err);
        //     //
        //     // // if no user is found, return the message
        //     // if (!user)
        //     //     return done(null, false, 'Username or Password incorrect');
        //     //
        //     // // if the user is found but the password is wrong
        //     //
        //     // // if (!user.validPassword(password))
        //     // if (!bcrypt.compareSync(password, user.local.password))
        //     //     return done(null, false); // create the loginMessage and save it to session as flashdata
        //     //
        //     // // all is well, return successful user
        //     // // // req.session.localeString = 'en-GB'; // will be saved on user profile
        //     // // req.session.localeString = user.localeString; // will be saved on user profile
        //     // //         //set utc offset time on session
        //     // //         req.session.localeString = req.user.locale;
        //     // //         req.session.utcOffset = req.body['utc-offset'];
        //     //
        //     // return done(null, user);
        // });
        // console.log(mongo);
        // done(null, user)

        // User.findById(id, done);
    });

    passport.use('local-login', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done)
        {
            console.log('login:' + email + '|' + password);
            //     co(function*()
            //     {
            //     // User.findOne({ 'local.email' :  email }, function(err, user)
            //     User.findOne({}, function(err, user)
            //     {
            //         // if there are any errors, return the error before anything else
            //         if (err)
            //             return done(err);
            //
            //         console.log(user);
            //
            //         // if no user is found, return the message
            //         if (!user) return done(null, false);
            //         // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            //
            //         // if the user is found but the password is wrong
            //         if (!user.validPassword(password)) return done(null, false);
            //         // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            //
            //         // all is well, return successful user
            //         // req.session.localeString = 'en-GB'; // will be saved on user profile
            //         // ctx.request.session.localeString = user.localeString; // will be saved on user profile
            //
            //         return done(null, user);
            //     });
            // })();
            // console.log(this);
            //   this.mongo.collection('users').findOne({}, function (err, doc) {
            //     console.log(doc);
            //   });
            // console.log('before co');
            co(function*()
            {
                console.log('inside co');
                try
                {
                    console.log('finding user');
                    var user =
                        yield User.findOne(
                        {
                            'local.email': email
                        }).exec();
                    // var user =
                    //     yield this.findOne(
                    //     {
                    //         'username': username.toLowerCase()
                    //     }).exec();

                    console.log('user:' + user);

                    if (!user) throw new Error('Username or Passowrd is incorrect.');
                    // if (!user) return dn(null, false, 'Username or Password incorrect');

                    var valid =
                        yield user.validPassword(password);

                    if (valid)
                    {
                        req.session.testVariable = 'testing123';
                        // req.session.localeString = req.user.locale;
                        // req.session.utcOffset = req.body['utc-offset'];

                        console.log('success returning user co');
                        return user;
                        // console.log(dn);
                        // return dn(null, user);
                    }

                    // password does not match, but don't want to say that.
                    // return dn(null, false);
                    throw new Error('Username or Passowrd is incorrect.');
                    // return yield User.matchUser(username, password);
                }
                catch (ex)
                {
                    console.log('Error:' + ex)
                    return null;
                }
            })(done);

            console.log('outside done co');
            // })(done);
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            // req.mongo.collection('users').findOne(
            // {
            //     'local.email': email
            // }, function(err, user)
            // {
            //     console.log(user);
            //
            //     // if there are any errors, return the error before anything else
            //     if (err)
            //         return done(err);
            //
            //     // if no user is found, return the message
            //     if (!user)
            //         return done(null, false, 'Username or Password incorrect');
            //
            //     // if the user is found but the password is wrong
            //
            //     // if (!user.validPassword(password))
            //     if (!bcrypt.compareSync(password, user.local.password))
            //         return done(null, false); // create the loginMessage and save it to session as flashdata
            //
            //     // all is well, return successful user
            //     // // req.session.localeString = 'en-GB'; // will be saved on user profile
            //     // req.session.localeString = user.localeString; // will be saved on user profile
            //     //         //set utc offset time on session
            //     //         req.session.localeString = req.user.locale;
            //     //         req.session.utcOffset = req.body['utc-offset'];
            //
            //     return done(null, user);
            // });
        }));

    passport.use('local-signup', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done)
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


    // // config/passport.js
    //
    // // load all the things we need
    // var LocalStrategy   = require('passport-local').Strategy;
    //
    // // load up the user model
    // // var User            = require('../models/user');
    //
    // // expose this function to our app using module.exports
    // module.exports = function(mongoose, passport)
    // {
    //     var User = require('../models/user')(mongoose);
    //
    //     // used to serialize the user for the session
    //     passport.serializeUser(function(user, done)
    //     {
    //         done(null, user.id)
    //     });
    //
    //     // used to deserialize the user
    //     passport.deserializeUser(function(id, done)
    //     {
    //         User.findById(id, function(err, user)
    //         {
    //             done(err, user);
    //         });
    //     });
    //
    //     passport.use('local-signup', new LocalStrategy(function(email, password, done) {
    //
    //         User.findOne({ 'local.email' :  email }, function(err, user) {
    //             // if there are any errors, return the error
    //             if (err) return done(err);
    //
    //             // check to see if theres already a user with that email
    //             if (user) {
    //                 return done(null, false);
    //                 // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //             } else {
    //
    //                 // if there is no user with that email
    //                 // create the user
    //                 var newUser            = new User();
    //
    //                 // set the user's local credentials
    //                 newUser.local.email    = email;
    //                 newUser.local.password = newUser.generateHash(password);
    //                 newUser.locale         = req.localeString;
    //
    //                 // save the user
    //                 newUser.save(function(err) {
    //                     if (err)
    //                         throw err;
    //
    //                     //req.session.localeString = user.localeString;
    //
    //                     return done(null, newUser);
    //                 });
    //             }
    //
    //         });
    //           // retrieve user ...
    //         // if (username === 'test' && password === 'test')
    //         // {
    //         //     done(null, user)
    //         // } else
    //         // {
    //         //     done(null, false)
    //         // }
    //     }));
    //
    //     // passport.use(new LocalStrategy(function(username, password, done) {
    //     //       // retrieve user ...
    //     //     if (username === 'test' && password === 'test')
    //     //     {
    //     //         done(null, user)
    //     //     } else
    //     //     {
    //     //         done(null, false)
    //     //     }
    //     // }));
    //
    //     passport.use('local-login', new LocalStrategy(function(ctx, email, password, done)
    //     {
    //         User.findOne({ 'local.email' :  email }, function(err, user)
    //         {
    //             // if there are any errors, return the error before anything else
    //             if (err)
    //                 return done(err);
    //
    //             // if no user is found, return the message
    //             if (!user) return done(null, false);
    //                 // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    //
    //             // if the user is found but the password is wrong
    //             if (!user.validPassword(password)) return done(null, false);
    //                 // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    //
    //             // all is well, return successful user
    //             // req.session.localeString = 'en-GB'; // will be saved on user profile
    //             ctx.request.session.localeString = user.localeString; // will be saved on user profile
    //
    //             return done(null, user);
    //         });
    //     }));
    //
    //
    //     // =========================================================================
    //     // LOCAL SIGNUP ============================================================
    //     // =========================================================================
    //     // we are using named strategies since we have one for login and one for signup
    //     // by default, if there was no name, it would just be called 'local'
    //
    //     // passport.use('local-signup', new LocalStrategy({
    //     //     // by default, local strategy uses username and password, we will override with email
    //     //     usernameField : 'email',
    //     //     passwordField : 'password',
    //     //     passReqToCallback : true // allows us to pass back the entire request to the callback
    //     // },
    //     // function(req, email, password, done) {
    //
    //     //     // asynchronous
    //     //     // User.findOne wont fire unless data is sent back
    //     //     process.nextTick(function() {
    //
    //     //     // find a user whose email is the same as the forms email
    //     //     // we are checking to see if the user trying to login already exists
    //     //     User.findOne({ 'local.email' :  email }, function(err, user) {
    //     //         // if there are any errors, return the error
    //     //         if (err)
    //     //             return done(err);
    //
    //     //         // check to see if theres already a user with that email
    //     //         if (user) {
    //     //             return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //     //         } else {
    //
    //     //             // if there is no user with that email
    //     //             // create the user
    //     //             var newUser            = new User();
    //
    //     //             // set the user's local credentials
    //     //             newUser.local.email    = email;
    //     //             newUser.local.password = newUser.generateHash(password);
    //     //             newUser.locale         = req.localeString;
    //
    //     //             // save the user
    //     //             newUser.save(function(err) {
    //     //                 if (err)
    //     //                     throw err;
    //
    //     //                 //req.session.localeString = user.localeString;
    //
    //     //                 return done(null, newUser);
    //     //             });
    //     //         }
    //
    //     //     });
    //
    //     //     });
    //
    //     // }));
    //
    //     // =========================================================================
    //     // LOCAL LOGIN =============================================================
    //     // =========================================================================
    //     // we are using named strategies since we have one for login and one for signup
    //     // by default, if there was no name, it would just be called 'local'
    //
    //     // passport.use('local-login', new LocalStrategy({
    //     //     // by default, local strategy uses username and password, we will override with email
    //     //     usernameField : 'email',
    //     //     passwordField : 'password',
    //     //     passReqToCallback : true // allows us to pass back the entire request to the callback
    //     // },
    //     // function(req, email, password, done) { // callback with email and password from our form
    //
    //     //     // find a user whose email is the same as the forms email
    //     //     // we are checking to see if the user trying to login already exists
    //     //     User.findOne({ 'local.email' :  email }, function(err, user) {
    //     //         // if there are any errors, return the error before anything else
    //     //         if (err)
    //     //             return done(err);
    //
    //     //         // if no user is found, return the message
    //     //         if (!user)
    //     //             return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    //
    //     //         // if the user is found but the password is wrong
    //     //         if (!user.validPassword(password))
    //     //             return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    //
    //     //         // all is well, return successful user
    //     //         // req.session.localeString = 'en-GB'; // will be saved on user profile
    //     //         req.session.localeString = user.localeString; // will be saved on user profile
    //
    //     //         return done(null, user);
    //     //     });
    //
    //     // }));
    //
    // };
};
