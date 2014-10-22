var passport = require('koa-passport');

module.exports = function (public, secured)
{
	public.get('login', '/login', function* login(next)
	{
		// render the page and pass in any flash data if it exists
		yield this.render('main/login.jade',
		{
			csrf: this.csrf,
			title: this.locale.translate('login/title'),
			email: this.locale.translate('login/email'),
			password: this.locale.translate('login/password'),
			forgot: this.locale.translate('login/forgot'),
			language: this.locale.translate('login/language')
		});
	});

	public.post('/login', function* (next)
	{
		var ctx = this

		yield passport.authenticate('local-login',
		{
			successRedirect: secured.url('root'),
			failureRedirect: public.url('login')
		});
		// ,
		// function*(err, user, info)
		// {
		//     // console.log(err);
		//     // console.log(user);
		//     // console.log(info);
		//     //
		//     // if (err || !user)
		//     //     ctx.redirect(public.url('login'));
		//     //
		//     // console.log('User Locale:' + ctx.request.user.locale);
		//     //
		//     // ctx.session.localeString = ctx.request.user.locale;
		//     // // ctx.session.utcOffset = ctx.request.body['utc-offset'];
		//     //
		//     // console.log('redirecting to root');
		//     // ctx.redirect(secured.url('root'));
		// }
	});

	public.get('language', '/language', function* (next)
	{

		// render the page and pass in any flash data if it exists
		yield this.render('main/language.jade',
		{
			title: this.locale.translate('language/title'),
			selectLangMsg: this.locale.translate('language/selectLangMsg'),
			setLangMsg: this.locale.translate('language/setLangMsg'),
			localeString: this.localeString,
			languages: [
			{
				'text': 'English (UK)',
				'value': 'en-GB'
			},
			{
				'text': 'English (US)',
				'value': 'en'
			},
			{
				'text': 'Français (France)',
				'value': 'fr'
			},
			{
				'text': '中国 (简体)',
				'value': 'zh-Hant'
			}]
		});
	});

	public.post('/language', function* (next)
	{

		// set long lived cookie, 10 years if it's not found by cookie monster in the mean time....
		this.cookies.set('locale', this.localeString,
		{});
		// res.cookie('locale', req.localeString, { path: '/', secure: false, maxAge: 60 * 60 * 24 * 365 * 10, httpOnly: false });

		// console.log(req.session.returToLogin);
		if (this.session.returnUrl)
		{
			this.redirect(this.session.returnUrl);
		}
		else
		{
			this.redirect(public.url('login'));
		}
	});

	public.get('logout', '/logout', function* (next)
	{
		this.logout();
		this.redirect(public.url('login'));
	});
};
