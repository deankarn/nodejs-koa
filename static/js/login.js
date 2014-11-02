// Generated by CoffeeScript 1.8.0
define(["main", "common.datetime"], function(main, dt) {
  var initialize, self, setUtcOffsetTime;
  initialize = function() {
    var rules;
    setUtcOffsetTime();
    rules = {
      email: {
        identifier: 'email',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your Email'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your Password'
          }
        ]
      }
    };
    $('#login-ct').find('form.ui.form').form(rules, {
      inline: true,
      on: 'submit'
    });
    return true;
  };
  setUtcOffsetTime = function() {
    var elem, offset;
    offset = dt.getUtcTimezoneOffsetInSeconds();
    elem = document.getElementById('utc-offset');
    return elem.value = offset;
  };
  return self = {
    initialize: initialize
  };
});
