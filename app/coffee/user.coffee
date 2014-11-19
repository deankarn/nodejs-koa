define "user", ["main", "fullscreen-form"], (main, FullscreenForm) ->

    initializeAdd = () ->

        #doubles as the .ff-ct
        ct = $('#user-ct')

        # rules = {
        #     email: {
        #       identifier : 'email',
        #       rules: [
        #         {
        #           type : 'empty',
        #           prompt : 'Please enter your Email'
        #         }
        #       ]
        #     } ,
        #     password: {
        #       identifier : 'password',
        #       rules: [
        #         {
        #           type : 'empty',
        #           prompt : 'Please enter your Password'
        #         }
        #       ]
        #     },
        #     locale: {
        #       identifier : 'locale',
        #       rules: [
        #         {
        #           type : 'empty',
        #           prompt : 'Please select a Language'
        #         }
        #       ]
        #     }
        # }
        #
        # ct = $('#user-ct')
        #
        # ct.find('form.ui.form').form(rules, {
        #     inline : true,
        #     on : 'submit'
        #   } )
        # true

        # ct.find('form.ui.form').form()
        ct.find('div.ui.selection.dropdown').dropdown();

        func = (callback) ->
            results = {}
            results.error = true
            # results.success = true
            results.message = 'what a super save'
            callback(results, successCallback)
            true

        new FullscreenForm( ct[0], { ctrlNavProgress: false, ctrlContinueText: 'Move Along', ctrlContinueSubtext: 'or NOT it\'s your choice', onComplete: func})

        true

    successCallback = ()->
        # similar behavior as an HTTP redirect
        window.location.replace "/"

        # similar behavior as clicking on a link
        # window.location.href = "http://stackoverflow.com"

    self = {
        initializeAdd: initializeAdd
    }
