module.exports = function(app, passport)
{
    app.get('/', function* root(next)
    {
        yield this.render('main/test',
        {
            csrf: this.csrf,
            title: "Test Partial Content",
        });
    });

    app.get('/partials/test', function* partial(next)
    {
        yield this.render('partials/test',
        {
            csrf: this.csrf,
            title: "Test Partial Content",
        });
    });
};
