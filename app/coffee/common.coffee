define [], () ->

    initialize = () ->
        true

    hasClass = (el, className) ->
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(el.className);

    addClass = (elem, className) ->
        elem.className = (elem.className + ' ' + className).trim() if not hasClass elem, className

    addClasses = (el, array) ->
        addClass el, ael for ael in array
        true

    removeClass = (elem, className) ->
        newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if hasClass elem, className
            while newClass.indexOf(' ' + className + ' ') >= 0
                newClass = newClass.replace(' ' + className + ' ', ' ')
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        true

    getCookie = (name) ->
        key = namr + '='
        ca = document.cookie.split(';');

        for c in ca
            if c.indexOf(key) == 0
                res = c.substring(key.length, c.length);

                return res;

        true

    self = {
        initialize: initialize,
        hasClass: hasClass,
        addClass: addClass,
        addClasses: addClasses,
        removeClass: removeClass,
        getCookie: getCookie
    };
