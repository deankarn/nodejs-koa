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

        new FullscreenForm( ct[0], { ctrlNavProgress: false})

        true

    self = {
        initializeAdd: initializeAdd
    }
