App.test_partial = (function (parent, window, document, $)
{
    function initialize()
    {
        $('#test-partial').find('.ui.dropdown').dropdown();
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

App.test_partial.initialize();