var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb://127.0.0.1:27017/issues");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var issueSchema = new Schema({
	//Username of the author
	username: {
		type: String
	},

	//Which Department does the issue belongs
	department: {
		type: String
	},

	//Status : Open or Close
	status: {
		type: Boolean,
	},

	issueTopic: {
		type: String
	},
	issueDesc: {
		type: String
	},

	//Anonymouse or not
	identity: {
		type: String
	},

	//Number of likes
	likes: {
		type: Number,
		default: 0,
	},

	//Comments to be implemented Later
	// comment: [{
	// 	type: String
	// }],

	//date potsed 
	datePosted: {
		type: Date,
		default: new Date()
	}
});


var Issue = module.exports = mongoose.model('Issue', issueSchema);

module.exports.createIndividualIssue = function(newIssue, callback) {
	newIssue.datePosted = new Date();
	newIssue.save(callback);
}

module.exports.createAnonymousIssue = function(newIssue, callback) {
	bcrypt.hash(newIssue.username, SALT_WORK_FACTOR, function(err, hash) {
      if (err) return err;
      // override the cleartext password with the hashed one
      newIssue.username = hash;
      newIssue.save(callback);
    });
}

module.exports.getIssueByUsername = function(username, callback) {
	var query = {
		username: username
	}
	Issue.find(query, callback);
}

module.exports.getByDate = function(callback){
	Issue.find().sort({datePosted: 1}).limit(10, callback);
}

module.exports.getUserByLikes = function(id, callback) {
	Issue.find().sort({likes: 1}).limit(10, callback);
};





