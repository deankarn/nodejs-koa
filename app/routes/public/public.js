var passport = require('koa-passport');

module.exports = function(public, secured)
{
    public.get('login', '/login', function* login(next)
    {
        // render the page and pass in any flash data if it exists
        yield this.render('main/login.jade',
        {
            csrf: this.csrf,
            title: 'Login',
            email: 'Email',
            password: 'Password',
            forgot: 'Forgot',
            language: 'Language'
        });
    });

    public.post('/login', function*(next)
    {
        var ctx = this

        yield passport.authenticate('local-login',
            {
                successRedirect: secured.url('root'),
                failureRedirect: public.url('login')
            }),
            function*(err, user, info)
            {
                console.log(err);
                console.log(user);
                console.log(info);

                if (err || !user)
                    ctx.redirect(public.url('login'));

                // req.session.localeString = ctx.request.user.locale;
                // req.session.utcOffset = ctx.request.body['utc-offset'];

                console.log('redirecting to root');
                ctx.redirect(secured.url('root'));
            }
    });

    public.get('logout', '/logout', function*(next)
    {
        this.logout();
        this.redirect(public.url('login'));
    });
};
