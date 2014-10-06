Common.datetime = (function (parent, window, document, $)
{
    function initialize()
    {
        // here for future stuff like gathering holidays for your region etc...
    }

    function getStdTimezoneOffset()
    {
        var dt = new Date();
        var fullYear = dt.getFullYear();
        var jan = new Date(fullYear, 0, 1);
        var jul = new Date(fullYear, 6, 1);

        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    function isTodayDst()
    {
        return getTimezoneOffset() < getStdTimezoneOffset();
    }

    function getTimezoneOffset()
    {
        return new Date().getTimezoneOffset()
    }

    function getUtcOffsetInSpiteOfDstInSeconds(){

        var dst = 0;
        var offset = getTimezoneOffset();

        if(isTodayDst())
        {
            dst = 60;

            if(offset < 0)
            {
                dst = dst * -1;
            }
        }

        return (offset + dst) * 60 * -1;
    }

    function getUtcTimezoneOffsetInSeconds()
    {
        return getTimezoneOffset() * 60 * -1;
    }

    function setDebug(val)
    {
        debug = val;
    }

    var debug = false;

    var self = {
        setDebug: setDebug,
        initialize: initialize,
        getUtcOffsetInSpiteOfDstInSeconds: getUtcOffsetInSpiteOfDstInSeconds,
        getUtcTimezoneOffsetInSeconds: getUtcTimezoneOffsetInSeconds
    };

    return self;

})(Common, window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);

Common.datetime.initialize();