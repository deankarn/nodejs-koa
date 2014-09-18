App.index_view = (function (parent, window, document, $)
{
    function initialize()
    {
        setupMenuListeners();
    }

    function setupMenuListeners()
    {
        //var partial = document.getElementById('partial-ct');

        var partial = $('#partial-ct');

        // partial.addClass('loading');

        var home = document.getElementById('home');

        home.onclick = function(e){
            e.preventDefault();

            // partial.addClass('loading');

            partial.load('/main/partials/dashboard');

            // setTimeout(function(){
            //   //partial.removeClass('loading');
            // }, 2000);

            
        };

        home.click();
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

App.index_view.initialize();