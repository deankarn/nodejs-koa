Common.Url = (function (parent, window, document, $)
{
    function getParams(){

        var qs = document.location.search.split('+').join(' '),
            params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    function setDebug(val){
        debug = val;
    }

    var initialized = false;
    var debug = false;

    var self = {
        setDebug: setDebug,
        getParams: getParams
    };

    return self;

})(Common, window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);
