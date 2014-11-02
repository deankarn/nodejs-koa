define ["main", "common.datetime"], (main, dt) ->
    initialize = () ->
        setUtcOffsetTime()

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
            }
        }

        $('#login-ct').find('form.ui.form').form(rules, {
            inline : true,
            on : 'submit'
          } )
        true

    setUtcOffsetTime = () ->
        offset = dt.getUtcTimezoneOffsetInSeconds()
        elem = document.getElementById('utc-offset')
        elem.value = offset

    self = {
        initialize: initialize
    }
