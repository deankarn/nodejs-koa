define ["main"], (main) ->

    initializeAdd = () ->

        rules = {
            email: {
              identifier : 'email',
              rules: [
                {
                  type : 'empty',
                  prompt : 'Please enter your Email'
                }
              ]
            } ,
            password: {
              identifier : 'password',
              rules: [
                {
                  type : 'empty',
                  prompt : 'Please enter your Password'
                }
              ]
            },
            locale: {
              identifier : 'locale',
              rules: [
                {
                  type : 'empty',
                  prompt : 'Please select a Language'
                }
              ]
            }
        }

        ct = $('#user-ct')

        ct.find('form.ui.form').form(rules, {
            inline : true,
            on : 'submit'
          } )
        true

        ct.find('div.ui.selection.dropdown').dropdown();

    self = {
        initializeAdd: initializeAdd
    }
