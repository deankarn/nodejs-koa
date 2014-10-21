module.exports = function(public, secured)
{
    secured.get('root', '/', function* root(next)
    {
        yield this.render('partials/test',
        {
            csrf: this.csrf,
            title: "Test Partial Content",
        });

        // yield this.render('main/login',
        // {
        //     csrf: this.csrf,
        //     title: "Login",
        // });
    });

    secured.get('partials-test', '/partials/test', function* partial(next)
    {
        yield this.render('partials/test',
        {
            csrf: this.csrf,
            title: "Test Partial Content",
        });
    });
};
