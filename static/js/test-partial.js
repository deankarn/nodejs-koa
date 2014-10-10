define(function (require) {
    // require('main');

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

    // initialize();

    return self;
});
