var mongoose = require("mongoose");
//require("mongoose-type-url");
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
});

var db = mongoose.connection;

var Schema = mongoose.Schema;

var memberSchema = new Schema({
		username : {
			type: String,
		},
		name:{
			type:String
		}
	},{_id : false});

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

	orgLink: {
		type: String//mongoose.SchemaTypes.Url
	},

	orgAvatarPath : {
		type: String,
		default: "univ.png"
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
	members: [memberSchema],
	//Listing of Admins
	admin: [memberSchema],
	//The users those have requested to join
	pendingRequest : [memberSchema],
});

var Org = module.exports = mongoose.model("Org", orgSchema);

// Org.ensureIndexes(function (err) {
//   console.log("ENSURE INDEX")
//   if (err) console.log(err)
// });


//mongoose.set("debug", true);
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
	console.log("Entered the orgs database");
	//Remove from the pending request fields
	Org.findOneAndUpdate({userId: orgUId}, {$pull: {pendingRequest : userObj}}).exec(Org.findOneAndUpdate({userId: orgUId}, {$addToSet : {members : userObj}}, callback));
	//Add to the members field
}

module.exports.declinePendingReq = function(orgUId, userObj, callback){
	//Accepting Pending requests can be only performed by the admins.
	console.log("Entered the orgs database");
	//Remove from the pending request fields
	Org.findOneAndUpdate({userId: orgUId}, {$pull: {pendingRequest : userObj}}, callback);
	//Add to the members field
}

module.exports.exitOrgAdmin = function(orgUId, userObj, callback){
	//find the member from member list and remove him
	Org.findOneAndUpdate({userId: orgUId}, {$pull : {admin : userObj}}, callback);
}

module.exports.exitOrgMember = function(orgUId, userObj, callback){
	//find the member from member list and remove him
	Org.findOneAndUpdate({userId: orgUId}, {$pull : {members : userObj}}, callback);
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

module.exports.findInOrg = function(pattern, callback){
	pattern = new RegExp(pattern, 'i');
	Org.find({
					$or : [
						{
							'name' : pattern
						},
						{
							'userId' : pattern
						},
						{
							'aboutUs' : pattern
						},
						{
							'orgLink' : pattern
						}
					]
	}).exec(callback);
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
