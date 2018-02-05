var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
var randomstring = require('randomstring');
var SALT_WORK_FACTOR = 10;

mongoose.connect("mongodb://127.0.0.1:27017/orgs");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var orgSchema = new Schema({
	//userID is the organisation user id
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
	members: [{
		username :{
			type: String,
		},
		name:{
			type:String
		},
		DateIntraction:{
			type: Date,
			default: Date.now()
		}
	}],
	//Listing of Admins
	admin: [{
		username : {
			type: String,
		},
		name:{
			type:String
		},
		DateIntraction:{
			type: Date,
			default: Date.now()
		}
	}],
	//The users those have requested to join
	pendingRequest : [{
		username : {
			type: String,
		},
		name:{
			type:String
		},
		DateIntraction:{
			type: Date,
			default: Date.now()
		}
	}],
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

module.exports.makeUserAdmin = function(orgUId, userObj, callback){
	// if already an Admin Do nothing
	// else
	// 	make him admin
	Org.findOneAndUpdate({userId: orgUId}, {$addToSet: {admin : userObj}}, callback);
}

module.exports.enterOrg = function(orgUId,  userObj, callback){
	// If the user already exists in the organisation 
	// 	do nothing
	// else
	// 	make him a member of the organisation
	Org.findOneAndUpdate({userId: orgUId}, {$addToSet: {pendingRequest : userObj}}, callback);
}

module.exports.acceptPendingReq = function(orgUId, userObj, callback){
	//Accepting Pending requests can be only performed by the admins.

	//Remove from the pending request fields
	Org.findOneAndUpdate({userId: orgUId}, {$pull: {pendingRequest : userObj}});
	//Add to the members field
	Org.findOneAndUpdate({userId: orgUId}, {$addToSet: {members : userObj}}, callback);
}

module.exports.exitOrgAll = function(orgUId, userObj, callback){
	//find the Admin from Admin list and remove him
	// When someone is admin and leaves a gorup, exit him from the member group as well.
	Org.findOneAndUpdate({userId: orgUId}, {$pull : {admin : userObj, members: userObj}}, callback);
}

module.exports.exitOrgAdmin = function(orgUId, userObj, callback){
	//find the member from member list and remove him
	Org.findOneAndUpdate({userId: orgUId}, {$pull : {admin : userObj}}, callback);
}

module.exports.deleteOrg = function(orgUId, userObj, callback){
	//Search the entire org list that contails both the organisationID and admin contains the username Admin  
	Org.remove({$and : [{userId: orgUId, admin: {$elemMatch : userObj}}]}, callback);
}

module.exports.deleteOrgEmptyMember = function(orgUId, callback){
	//Search the entire org list that contails both the organisationID and admin contains the username Admin  
	Org.remove({userId: orgUId}, callback);
}

module.exports.chkAdmin = function(orgUId, userObj, callback){
	Org.findOne({$and : [{userId:orgUId, admin : {$elemMatch : userObj}}]}, callback);
}

module.exports.chkMember = function(orgUId, userObj, callback){
	Org.findOne({$and : [{userId:orgUId, members : {$elemMatch : userObj}}]}, callback);
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

module.exports.adminOrgs = function(userObj, callback){
	Org.find({admin : {$elemMatch : userObj}}, callback);
}

module.exports.memberOrgs = function(userObj, callback){
	Org.find({members : {$elemMatch : userObj}}, callback);
}

module.exports.pendingOrgs = function(userObj, callback){
	Org.find({pendingRequest : {$elemMatch : userObj}}, callback);
}
