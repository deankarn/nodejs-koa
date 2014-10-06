App.signup_view = (function (parent, window, document, $)
{
    function initialize()
    {
        setUtcOffsetTime()
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

App.signup_view.initialize();