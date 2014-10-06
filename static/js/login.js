define(function (require) {
    require('main');

    function initialize()
    {
        // setUtcOffsetTime();

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
        // initialize: initialize,
    };

    initialize();

    return self;
});
