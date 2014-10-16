var koaBody = require('koa-better-body');

module.exports = function(public, secured, passport)
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
        // yield this.render('main/login.jade',
        // {
        //     csrf: this.csrf,
        //     title: req.locale.translate('login/title'),
        //     email: req.locale.translate('login/email'),
        //     password: req.locale.translate('login/password'),
        //     forgot: req.locale.translate('login/forgot'),
        //     language: req.locale.translate('login/language'),
        //     message: req.flash('loginMessage')
        // });
    });

    // public.post('/login', function*(next)
    // {
    //     console.log(this.request.body.fields.email);
    //     this.redirect(public.url('login'));
    // });
    public.post('/login',
        passport.authenticate('local-login',
        {
            successRedirect: secured.url('root'),
            failureRedirect: public.url('login')
        },
        function*(err, user, info)
        {
            console.log(info);
            console.log(user);
            console.log(err);
        }
        )

    );

    public.get('logout', '/logout', function*(next)
    {
        this.logout();
        this.redirect(public.url('root'));
    });

    // process the login form
    // app.post('/login', passport.authenticate('local-login',
    //     {
    //         // successRedirect : '/profile', // redirect to the secure homepage
    //         failureRedirect: '/login', // redirect back to the signup page if there is an error
    //         failureFlash: true // allow flash messages
    //     }),
    //     function(req, res)
    //     {
    //
    //         //set utc offset time on session
    //         req.session.localeString = req.user.locale;
    //         req.session.utcOffset = req.body['utc-offset'];
    //
    //         //res.redirect('/profile');
    //         res.redirect('/');
    //     });
};