// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('co-bcrypt');
var co       = require('co');

// const SALT_WORK_FACTOR = 10;

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    locale     : String,
    updated_at : { type: Date, default: Date.now },
    created_at : { type: Date, default: Date.now }
},
{
  toJSON : {
    transform: function (doc, ret, options) {
      delete ret.local.password;
    }
  }
});

userSchema.pre('save', function (done) {
    
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('local.password')) {
    return done();
  }

  co(function*() {
    try {
      var salt = yield bcrypt.genSalt(10);
      var hash = yield bcrypt.hash(this.local.password, salt, null);

      console.log(hash);

      this.local.password = hash;
      done();
    }
    catch (err) {
      done(err);
    }
  }).call(this, done);
});

// methods ======================
// generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// checking if password is valid
userSchema.methods.validPassword = function*(password) {
    return yield bcrypt.compare(password, this.local.password);
};
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
