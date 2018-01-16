var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

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
    unique: true
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

var User = models.exports = mongoose.model('User', userSchema);
