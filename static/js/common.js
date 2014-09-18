var Common = window.Common || (function(window, document, $)
{
    function initialize(){

    }

    function hasClass(el, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(el.className);
    }

    function addClass(elem, className) {
        if (!hasClass(elem, className)) {
            elem.className = (elem.className + ' ' + className).trim();
        }
    }

    function addClasses(el, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            addClass(el, array[i]);
        }
    }

    function removeClass(elem, className) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }

    function getCookie(name){

    	var key = namr + '=',
    		ca = document.cookie.split(';');

        for (var i = 0, len = ca.length; i < len; i++) {

            var c = ca[i].trim();

            if (c.indexOf(key) == 0) {

                var res = c.substring(key.length, c.length);

                return res;
            }
        }
    }

    var self = {
        initialize: initialize,
        hasClass: hasClass,
        addClass: addClass,
        addClasses: addClasses,
        removeClass: removeClass,
        getCookie: getCookie
    };

    return self;

})(window, document, typeof(jQuery) == 'undefined' ? {} : jQuery);

Common.initialize();