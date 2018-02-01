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
		type: String,
		required: true
	},

	//Which Department does the issue belongs
	orgUserId: {
		type: String,
		required: true
	},
	
	orgname:{
		type: String,
	},
	name: {
		type: String
	},
	//Status : Open or Close
	status: {
		type: String,
		default: "open"
	},

	issueTopic: {
		type: String
	},

	issueDesc: { 
		type:String
	},

	//Anonymouse or not
	anonymity: {
		type: String
	},

	spamCount: {
		type: Number,
		default:0
	},

	supporters: [String],

	comments: [String],

	//date potsed 
	datePosted: {
		type: Date
	},
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
	};
	Issue.find(query, callback);
}

module.exports.getIssuesByDate = function(date, callback){
	Issue.find({"datePosted" : { $lte : date }},callback).sort({datePosted: -1}).limit(10);
}

module.exports.getIssuesLatest = function(callback){
	Issue.find(callback).sort({datePosted: -1}).limit(10);
}

module.exports.getIssueByLikes = function(callback) {
	Issue.find(callback).sort({likes: -1}).limit(10);
};

module.exports.getIssueById = function(id, callback){
	var query = {
		_id : id
	}
	Issue.findOne(query, callback);
};

module.exports.chkWholeIssuesForLiked = function(username, callback){
	Issue.find({ supporters : username}, callback);
}
module.exports.chkUserLikedPost = function(username, id, callback) {
	Issue.findOne({ $and: [{_id :id}, { supporters : username }]}, callback);
}

module.exports.addUsertoSupporters = function(username, id, callback){
	Issue.findOneAndUpdate({ _id : id }, { $addToSet : { supporters : username}}, callback);	
}

module.exports.removeUsertoSupporters = function(username, id, callback){
	Issue.findOneAndUpdate({ _id : id }, { $pull : { supporters : username}}, callback);	
}

module.exports.incLikesByIssues = function(username, id, callback) {
	Issue.update({_id :id}, {$inc : {likes : 1}}, callback);
}

module.exports.dcrLikesByIssues = function(username, id, callback) {
	Issue.update({_id :id}, {$inc : {likes : -1}}, callback);
}
