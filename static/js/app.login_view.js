App.login_view = (function (parent, window, document, $)
{
    function initialize()
    {
        setUtcOffsetTime();

        var rules = {
            email: {
              identifier  : 'email',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your Email'
                }
              ]
            },
            password: {
              identifier  : 'password',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your Password'
                }
              ]
            }
        };

        $('.ui.form').form(rules, {
            inline : true,
            on     : 'submit'
          });
    }

    function setUtcOffsetTime()
    {
        var offset = Common.datetime.getUtcTimezoneOffsetInSeconds();
        var elem = document.getElementById('utc-offset');

        elem.value = offset;
    }

    function setDebug(val)
    {
        debug = val;
    }

    var debug = false;

    var self = {
        setDebug: setDebug,
        initialize: initialize,
    };

    return self;

})(App, window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);

App.login_view.initialize();