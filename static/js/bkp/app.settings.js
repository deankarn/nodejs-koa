App.settings = (function (parent, window, document, $)
{
    function initialize()
    {
        initialized = true;
    }

    function setDebug(val){
        debug = val;
    }

    var initialized = false;
    var debug = false;

    var self = {
        setDebug: setDebug,
        initialize: initialize
    };

    return self;

})(App, window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);


App.settings.initialize();