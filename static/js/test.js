define(function (require) {
    require('main');

    function initialize()
    {
        var button = document.getElementById('load-partials');

        button.onclick = loadPartialView;

        $('.ui.dropdown').dropdown();
    }

    function loadPartialView(e)
    {
        e.preventDefault();

        var self = this;

        $(self).addClass('loading');
        // Common.addClass(self, 'loading'); // jsperf this vs jquery add class on click and select logic too

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("error", function (e) {
            alert('error');
        }, false);

        xhr.addEventListener("timeout", function (e) {
            alert('timed out');
        }, false);

        xhr.addEventListener("abort", function (e) {
            alert('abort');
        }, false);

        xhr.addEventListener("readystatechange", function ()
        {
            if (this.readyState == 4)
            {
                if (this.status == 200)
                {
                    var results = this.responseText;

                    var div = document.getElementById('partial-content');

                    $(div).html(results);

                    $(self).removeClass('loading');
                    // Common.removeClass(self, 'loading');
                    // div.innerHTML = results;
                    // eval(div);
                }
            }
        }, false);

        var url = '/partials/test';

        xhr.open("get", url, true);
        xhr.send(null);
    }

    function setDebug(val)
    {
        debug = val;
    }

    var debug = false;

    var self = {
        setDebug: setDebug,
        initialize: initialize,
        loadPartialView: loadPartialView,
    };

    return self;
});
