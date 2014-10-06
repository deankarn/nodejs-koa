/*

NOTES & USAGE:

    WARNING this will only determine if element has scrolled out of view to the top,
            other checks can be added on an as needed basis, but will have to provide an options
            param to be passed in.

    - element passed in should be a container to the element you wish to float
    - element must have a fixed height set
    i.e.
    <div id='elem-ct' style='height:102px;'> <-- set height in css, just here for brevity
        <div id='floatable-elem'>
        </div>
    </div>

    the reason for these two conditions is we need an element to test if it is now back in focus and
    ensure that the entire element can now be viewed; so we don't get an unending loop

 */

Common.viewport = (function (parent, window, document, $)
{
    function initialize(){

        initialized = true;

        //jQuery
        $(window).on('DOMContentLoaded load resize scroll', CheckIfMonitoredElementsInViewport);

        /* //non-jQuery
         if (window.addEventListener) {
         addEventListener('DOMContentLoaded', handler, false);
         addEventListener('load', handler, false);
         addEventListener('scroll', handler, false);
         addEventListener('resize', handler, false);
         } else if (window.attachEvent)  {
         attachEvent('onDOMContentLoaded', handler); // IE9+ :(
         attachEvent('onload', handler);
         attachEvent('onscroll', handler);
         attachEvent('onresize', handler);
         }
         */
    }

    /**
     *
     * @param elem - Element to monitor; can be jQuery or raw HTML element
     * @param callback - function that is passed the element and true or false if the element is in Viewport or not.
     * @param offsets - array of offset values [top, left, bottom, right] used to shrink actual Viewport values
     *                  to help handle floating elements
     */
    function subscribeElementToViewportMonitor(elem, callback, offsets)
    {
        if(elem instanceof jQuery){
            elem = elem[0];
        }

        if(debug && !elem.id){
            console.error('Common.viewport.subscribeElementToViewportMonitor - element MUST have an ID for internal functions');
        }

        // 3rd array element is status, being track so that callback
        // is only called WHEN something has changed.
        // initially set to null to ensure that the first run will
        // always call the callback
        var monitor = [elem, callback, null, offsets];

        monitoring.push(monitor);

        if(!initialized){
            initialize();
        }
    }

    /**
     * iterating or monitoring elements to determine if in Viewport
     * @constructor
     */
    function CheckIfMonitoredElementsInViewport()
    {
        if(monitoring.length == 0){
            return;
        }

        if(!timeout){

            timeout = setTimeout(function(){

                for(i = 0, len = monitoring.length; i < len; i++){

                    var elem = monitoring[i][0];
                    var callback = monitoring[i][1];
                    var status = monitoring[i][2];
                    var offsets = monitoring[i][3];

                    var result = CheckIfElementInViewport(elem, callback, offsets);

                    // if status has changed since last check
                    // notify the subscriber
                    if(status != result)
                    {
                        monitoring[i][2] = result;
                        callback(elem, result);
                    }
                }

                timeout = null;
            }, 300);
        }

    }

    /**
     *
     * @param elem - Element to check if in viewport
     * @param callback - callback function to return result if elemnt has scrolled in or out of view
     * @param offsets - array of offset values [top, left, bottom, right] used to shrink actual Viewport values
     *                  to help handle floating elements
     * @returns {boolean}
     * @constructor
     */
    function CheckIfElementInViewport(elem, callback, offsets)
    {
        // if something happened to the lement or callback
        // and they are no longer set, let's just assume they
        // are in the Viewport
        if(!elem || !callback){
            return true;
        }

        var topOffset = offsets[0];
//        var leftOffset = offsets[1];
//        var bottomOffset = offset[2];
//        var rightOffset = offset[3];

        var elementBounds = elem.getBoundingClientRect();

        if(debug){
            console.log('Top: ' + elementBounds.top);
            console.log('Left: ' + elementBounds.left);
            console.log('Bottom: ' + elementBounds.bottom);
            console.log('Right: ' + elementBounds.right);

            console.log('Viewport Height: ' + (window.innerHeight || document.documentElement.clientHeight));
            console.log('Viewport Width: ' + (window.innerWidth || document.documentElement.clientWidth));
        }

        // this is a simple check to see if any corner of
        // element has gone outside of the viewport
        return (
            elementBounds.top - topOffset >= 0
//            elementBounds.left >= 0 &&
//            elementBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
//            elementBounds.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    function setDebug(val){
        debug = val;
    }

    var initialized = false;
    var monitoring = []; // array of array [elem, callback, status, offsets]
    var timeout = null;
    var debug = false;


    var self = {
        setDebug: setDebug,
        subscribeElementToViewportMonitor: subscribeElementToViewportMonitor
    };

    return self;

})(Common, window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);


