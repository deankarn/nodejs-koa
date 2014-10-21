var passport = require('koa-passport');

module.exports = function(public, secured)
{
    secured.get('useradd', '/user/add', function* useradd(next)
    {
        yield this.render('main/signup.jade', {
                csrf: this.csrf,
                title: 'Sign Up',
                email: 'Email',
                password: 'Password'
            });
        // yield this.render('main/signup.jade', {
        //         csrf: this.csrf,
        //         title: req.locale.translate('signup/title'),
        //         email: req.locale.translate('signup/email'),
        //         password: req.locale.translate('signup/password'),
        //         message: req.flash('signupMessage')
        //     });
    });

    secured.post('/user/add',
        passport.authenticate('local-signup',
        {
            successRedirect: secured.url('root'),
            failureRedirect: secured.url('useradd')
        },
        function*(err, user, info)
        {
            // req.session.localeString = req.user.locale;
            // req.session.utcOffset = req.body['utc-offset'];

            res.redirect(secured.url('useradd'));
            console.log(info);
            console.log(user);
            console.log(err);
        }
        )

    );
};
