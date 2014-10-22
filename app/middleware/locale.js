module.exports = function (Globalize, public)
{
	return function* (next)
	{
		var req = this.request,
			params = this.request.query;

		if (params.locale)
		{
			console.log('getting locale from input param:' + params.locale);

			this.localeString = params.locale;
			this.locale = new Globalize(this.localeString);
		}
		else
		{
			if (this.isAuthenticated())
			{
				console.log('getting locale from session:' + this.session.localeString);

				this.localeString = this.session.localeString;
				this.locale = new Globalize(this.localeString);
			}
			else
			{
				var cookie = this.cookies.get('locale');

				if (cookie)
				{
					console.log('getting locale from cookie:' + cookie);

					this.localeString = cookie;
					this.locale = new Globalize(this.localeString);
				}
				else
				{
					console.log('setting default locale:en-GB');

					this.localeString = 'en-GB';
					this.locale = new Globalize(this.localeString);

					if (!req.url.match(/^\/language(?:.+)?$/))
					{
						return this.redirect(public.url('language'));
					}
				}
			}
		}

		yield next; // go to next function, probably routes.
	}
}
