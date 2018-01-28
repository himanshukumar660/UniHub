var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
var randomstring = require('randomstring');
var SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb://127.0.0.1:27017/issues");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var issueSchema = new Schema({
	//Username of the author
	username: {
		type: String
	},
	//Name of the author
	name: {
		type: String
	},

	//Which Department does the issue belongs
	department: {
		type: String
	},

	//Status : Open or Close
	status: {
		type: String,
	},

	issueTopic: {
		type: String
	},
	issueDesc: {
		type: String
	},

	//Anonymouse or not
	anonymity: {
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
		type: Date
	}
});


var Issue = module.exports = mongoose.model('Issue', issueSchema);

module.exports.createIssue = function(newIssue, callback) {
	  console.log(newIssue.anonymity);
	  if(newIssue.anonymity=="on")
		{
			newIssue.username = randomstring.generate(10);	
		}
	  newIssue.datePosted = new Date();
      newIssue.save(callback);
};

module.exports.getIssueByUsername = function(username, callback) {
	var query = {
		username: username
	}
	Issue.find(query, callback);
}

module.exports.getByDate = function(callback){
	Issue.find(callback).sort({datePosted: -1}).limit(10);
}

module.exports.getIssueByLikes = function(callback) {
	Issue.find(callback).sort({likes: -1}).limit(10);
};





