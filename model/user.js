var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  String,
  username: String,
  email:   String,
  orgs : [String],
	password: String,
});

var User = models.exports = mongoose.model('User', userSchema);
