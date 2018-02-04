var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
var randomstring = require('randomstring');
var SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb://127.0.0.1:27017/orgs");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var orgSchema = new Schema({
	//Name of the author
	userId:{
		type: String,
		unique: true,
		index: true,
		required: true
	},
	
	name: {
		type: String,
		index : true,
		required:true
	},

	//date the organisation registered
	dateMade: {
		type: Date
	},
	alert:{
		type:String,
	},
	//About the organisation
	aboutUs: {
		type: String,
	},
	//Listing of all the members
	members: [String],
	//Listing of Admins
	admin: [String],
	//The users those have requested to join
	pendingRequest : [String],
});

orgSchema.index({'$**' : 'text'},{default_language : "none"});

var Org = module.exports = mongoose.model('Org', orgSchema);

// Org.ensureIndexes(function (err) {
//   console.log('ENSURE INDEX')
//   if (err) console.log(err)
// });

Org.on('index', function(err) {
    if (err) {
        console.error('Org index error: %s', err);
    } else {
        console.info('Org indexing complete');
    }
});

mongoose.set('debug', true);
module.exports.makeOrg = function(orgDetails, callback){
	//INCOMPLETE
	// if org name exists
	// 	throw an error
	// else make an organisation
	// 	also make the user that have made the organisation as admin

	orgDetails.dateMade = new Date();
	orgDetails.save(callback);
}

module.exports.makeUserAdmin = function(orgUId, username, callback){
	// if already an Admin Do nothing
	// else
	// 	make him admin
	Org.findOneAndUpdate({userId: orgUId}, {$addToSet: {admin : username}}, callback);
}

module.exports.enterOrg = function(orgUId,  username, callback){
	// If the user already exists in the organisation 
	// 	do nothing
	// else
	// 	make him a member of the organisation
	Org.findOneAndUpdate({userId: orgUId}, {$addToSet: {pendingRequest : username}}, callback);
}

module.exports.acceptPendingReq = function(orgUId, usernameOfReqUser,callback){
	//Accepting Pending requests can be only performed by the admins.

	//Remove from the pending request fields
	Org.findOneAndUpdate({userId: orgUId}, {$pull: {pendingRequest : usernameOfReqUser}});
	//Add to the members field
	Org.findOneAndUpdate({userId: orgUId}, {$addToSet: {members : usernameOfReqUser}}, callback);
}

module.exports.exitOrgAll = function(orgUId, username, callback){
	//find the Admin from Admin list and remove him
	// When someone is admin and leaves a gorup, exit him from the member group as well.
	Org.findOneAndUpdate({userId: orgUId}, {$pull : {admin : username, members: username}}, callback);
}

module.exports.exitOrgMember = function(orgUId, username, callback){
	//find the member from member list and remove him
	Org.findOneAndUpdate({userId: orgUId}, {$pull : {members : username}}, callback);
}

module.exports.deleteOrg = function(orgUId, usernameAdmin, callback){
	//Search the entire org list that contails both the organisationID and admin contains the username Admin  
	Org.remove({$and : [{userId: orgUId, admin: {$in : [usernameAdmin]}}]}, callback);
}

module.exports.deleteOrgEmptyMember = function(orgUId, callback){
	//Search the entire org list that contails both the organisationID and admin contains the username Admin  
	Org.remove({userId: orgUId}, callback);
}

module.exports.chkAdmin = function(orgUId, username, callback){
	Org.findOne({$and : [{userId:orgUId, admin : {$in : [username]}}]}, callback);
}

module.exports.chkMember = function(orgUId, username, callback){
	Org.findOne({$and : [{userId:orgUId, members : {$in : [username]}}]}, callback);
}

module.exports.findInOrg = function(orgname, callback){
	Org.find({$text : {
			$search : orgname,
			$caseSensitive : false}},
			{ score : { $meta: "textScore" } }).sort({ score : { $meta : 'textScore' } })
    .exec(callback); 
}

module.exports.findOrgByUID = function(orguid, callback){
	Org.findOne({userId : orguid}, callback);
}

module.exports.findOrgByID = function(orguid, callback){
	Org.findOne({userId : orguid}, callback);
}

module.exports.adminOrgs = function(username, callback){
	Org.find({admin : {$in : [username]}}, callback);
}

module.exports.memberOrgs = function(username, callback){
	Org.find({members : {$in : [username]}}, callback);
}

