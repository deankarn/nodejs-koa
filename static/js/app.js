var App = window.App || (function(window, document, $)
{

    function initialize(){

        // initializeToastrSettings();

        if(!focusOnFirstErrorField()){
            focusOnFirstField();
        }

        initialized = true;
    }

    function initializeToastrSettings()
    {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "ma-toast-top-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "10000",
            "extendedTimeOut": "3000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }

    function focusOnFirstField(){

    	var elements = document.querySelectorAll('input, textarea, select');

        if(elements.length === 0)
        {
            return false;
        }

        for(i=0, len=elements.length; i < len; i++)
        {
        	// if hidden offest width and height are zero
        	// only relyable way to determine is visible or not ( this is the way jQuery does it. )
        	if(!(elements[i].offsetWidth === 0 && elements[i].offsetHeight === 0))
        	{
                if(typeof(elements[i].select) === 'undefined')
                {
                    elements[i].focus();
                }
                else
                {
                    elements[i].select();
                }

        		return true;
        	}
        }

        return false;
    }

    function focusOnFirstErrorField()
    {
    	var errElem = document.querySelector('.error');

    	if(!errElem)
    	{
    		return false;
    	}

        var elements = errElem.querySelectorAll('input, textarea, select');

        if(elements.length === 0)
        {
            return false;
        }

        for(i=0, len=elements.length; i < len; i++)
        {
            // if hidden offest width and height are zero
            // only relyable way to determine is visible or not ( this is the way jQuery does it. )
            if(!(elements[i].offsetWidth === 0 && elements[i].offsetHeight === 0))
            {
                if(typeof(elements[i].select) === 'undefined')
                {
                    elements[i].focus();
                }
                else
                {
                    elements[i].select();
                }

                return true;
            }
        }

        return false;
    }

    function setDebug(val){
        debug = val;
    }

    var initialized = false;
    var debug = false;

    var self = {
    	setDebug: setDebug,
        initialize: initialize,
    };

    return self;

})(window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);

App.initialize();

/* Multi-line comment blocks (CSS, Stylus, JavaScript)
 *= require app.settings
 */