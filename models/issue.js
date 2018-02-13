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

	userAvatarPath:{
		type:String,
		default: "user.png"
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

	docsUpload: [{
		filename : {
			type: String
		},
		originalName: {
			type: String
		},
		_id : false
	}],

	supporters: [String],

	comments: [String],

	//date potsed 
	datePosted: {
		type: Date
	},

	edited : {
		type: Boolean
	},
});


var Issue = module.exports = mongoose.model('Issue', issueSchema);

module.exports.createIssue = function(newIssue, callback) {
	  console.log(newIssue.anonymity);
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

//Del anonymous issues by admin
module.exports.delIssueByAId = function(id, callback){
	var query = {
		_id : id,
	}
	Issue.remove(query, callback);
};

module.exports.delIssueById = function(id, username, callback){
	var query = {
		_id : id,
		username: username
	}
	Issue.remove(query, callback);
};

module.exports.openIssueById = function(id, username, callback){
	Issue.findOneAndUpdate({$and: [{_id:id}, {username:username}]},{status: "open"}, callback);
};

module.exports.closeIssueById = function(id, username, callback){
	Issue.findOneAndUpdate({$and: [{_id:id}, {username:username}]},{status: "closed"}, callback);
};

module.exports.updateIssueById = function(username, updatedIssue,  callback){
	Issue.findOneAndUpdate({$and: [{_id:updatedIssue.issueId}, {username:username}]},{issueTopic: updatedIssue.issueTopic, issueDesc: updatedIssue.issueDesc, datePosted: new Date, edited : true}, callback);
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

module.exports.getIssueByOrgUserId = function(orguid, callback){
	var query = {
		orgUserId : orguid
	}
	Issue.find(query, callback);
};

module.exports.getOpenIssueByOrgUserId = function(orguid, callback){
	Issue.find({$and : [{orgUserId : orguid}, {status : "open"}]}, callback);
};

module.exports.getAnnouncementIssues = function(callback){
	Issue.find({status : "Notice"}, callback);
};


module.exports.getClosedIssueByOrgUserId = function(orguid, callback){
	Issue.find({$and : [{orgUserId : orguid}, {status : "closed"}]}, callback);
};

module.exports.getAnonymousIssueByOrgUserId = function(orguid, callback){
	Issue.find({$and : [{orgUserId : orguid}, {anonymity : "on"}]}, callback);
};

module.exports.deleteIssueByOrgUserId = function(orguid, callback){
	var query = {
		orgUserId : orguid
	}
	Issue.remove(query, callback);
};


