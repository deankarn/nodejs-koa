define ["main"], (main) ->

    initialize = () ->
        $('#test-partial').find('.ui.dropdown').dropdown()
        true

    self = {
        initialize: initialize,
    };
