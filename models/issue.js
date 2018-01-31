var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
var randomstring = require('randomstring');
var SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb://127.0.0.1:27017/issues");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var issueDetails = new Schema({
	datePosted: {
		type: Date
	},
	
	department: {
		type: String,
		required: true
	},
	
	issueTopic: {
		type:String
	},

	issueDesc: {
		type:String
	},
	
	status: {
		type: String,
		default: "open"
	},
	
	supporters: [String],
	
	spamCount: {
		type: Number,
		default:0
	},
	
	comments: [{
		type: String
	}]

});

var issueSchema = new Schema({
	username: {
		type: String,
	},
	
	anonymity: {
		type: String
	},

	myissueDetails: [issueDetails],
});

var Issue = module.exports = mongoose.model('Issue', issueSchema);

var IssueDetails = mongoose.model('IssueDetails', issueDetails);

module.exports.addRaiser = function(newIssue, callback) {
	  console.log(newIssue.anonymity);
	  if(newIssue.anonymity=="on")
		{
			newIssue.username = randomstring.generate(10);	
		}
      newIssue.save(callback);
};

//Check if user has raised any issue
module.exports.chkUser = function(username, callback){
	Issue.findOne({username:username}, callback);
}

module.exports.addIssueDetails = function(username, issueDtl, callback) {
	Issue.findOneAndUpdate({username: username}, {$push: {myissueDetails : issueDtl}}, callback);
}

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
