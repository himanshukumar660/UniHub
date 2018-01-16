var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

mongoose.connect("mongodb://127.0.0.1:27017/nodeauth");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:  {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  orgs : [{
    type: String
  }],
	password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator, { message: '{PATH} already registered' });

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
  newUser.save(callback);
}
