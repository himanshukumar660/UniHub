var mongoose = require("mongoose");
// var uniqueValidator = require("mongoose-unique-validator");
var randomstring = require("randomstring");
var SALT_WORK_FACTOR = 10;

const uri = "mongodb://himanshu:himanshu103@ds243812.mlab.com:43812/unihub"
mongoose.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   // perform actions on the collection object
   //client.close();
});


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
		mimetype:{
			type: String
		},
		_id : false
	}],

	supporters: [String],

	haters: [String],

	comments: [String],

	//date potsed
	datePosted: {
		type: Date
	},

	edited : {
		type: Boolean
	},
});


var Issue = module.exports = mongoose.model("Issue", issueSchema);

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

module.exports.updateIssueById = function(updatedIssue,  callback){
	Issue.findOneAndUpdate({$and: [{_id:updatedIssue.issueId}, {status : "Notice"}]},{issueTopic: updatedIssue.issueTopic, issueDesc: updatedIssue.issueDesc, datePosted: new Date, edited : true}, callback);
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

module.exports.chkUserDislikedPost = function(username, id, callback) {
	Issue.findOne({ $and: [{_id :id}, { haters : username }]}, callback);
}

module.exports.addUsertoHaters = function(username, id, callback){
		Issue.findOneAndUpdate({ _id : id }, { $addToSet : { haters : username}}, callback);
}

module.exports.removeUsertoHaters = function(username, id, callback){
	Issue.findOneAndUpdate({ _id : id }, { $pull : { haters : username}}, callback);
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

module.exports.getAnnouncementIssuesByOrgUserId = function(orgUserId, callback){
	Issue.find({$and : [{status : "Notice"},{orgUserId : orgUserId}]}, callback);
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

module.exports.delNoticeById = function(postId, callback){
	var query = {
		_id : postId
	}
	Issue.remove(query, callback);
};
