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

userSchema.plugin(uniqueValidator);

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
  newUser.save(callback);
}

module.exports.getUserByUsername = function(username, callback){
  var query = {
    username:username
  }
  User.findOne(query,callback);
};


module.exports.getUserByAccount = function(username, password, callback){
  var query = {
    username:username,
    password:password
  }
  User.findOne(query,callback);
};

module.exports.getUserById = function(id, callback){
  User.findById(callback);
}
