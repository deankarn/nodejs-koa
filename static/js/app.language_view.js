
// postback on language selection to update with the selected language

// cookie must be/get set so that login page doesn't redirect here again

// must also find a way to know the original reuested page prior to the redirect here.
// implement middleware to store last URL requested that wasn't a redirect.

App.languageView = (function (parent, window, document, $)
{
    function initialize()
    {
        var rules = {
            'select-lang': {
              identifier  : 'select-lang',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please select a Language'
                }
              ]
            }
        };

        $('.ui.form').form(rules, {
            inline : true,
            on     : 'submit'
          });

        document.getElementById('submit-lang').onclick = submitOverride;
        select.onchange = languageChanged;

        initialized = true;
    }

    function languageChanged(e)
    {
        var lang = this.options[this.selectedIndex].value;
        window.location.href = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?locale=' + lang;
    }

    function submitOverride(e)
    {
        e.preventDefault();

        var form = document.getElementById('lang-form'),
            lang = select.options[select.selectedIndex].value;

        form.action = form.action + '?locale=' + lang;

        form.submit();
    }

    function setDebug(val){
        debug = val;
    }

    var select = document.getElementById('select-lang');
    var initialized = false;
    var debug = false;

    var self = {
        setDebug: setDebug,
        initialize: initialize
    };

    return self;

})(App, window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);


App.languageView.initialize();