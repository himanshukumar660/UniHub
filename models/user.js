var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var bcrypt = require("bcrypt");
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

var orgDetailScehma = new Schema({
	orgname: {
		type : String
	},
	orguid: {
		type : String
	}
});
var userSchema = new Schema({
	name: {
		type: String
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true
	},
	password: {
		type: String,
		required: true,
	},

	//orgs: [orgDetailScehma],

	avatarPath: {
		type: String,
		default: "user.png"
	}
});

userSchema.plugin(uniqueValidator);

var User = module.exports = mongoose.model("User", userSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, SALT_WORK_FACTOR, function(err, hash) {
      if (err) return err;
      // override the cleartext password with the hashed one
      newUser.password = hash;
      newUser.save(callback);
    });
}

module.exports.getCredentialDetails = function(type, credential, callback) {
	console.log(type);
	if(type=="email")
		User.findOne({email:credential}, callback);
	else if(type=="username")
		User.findOne({username:credential}, callback);
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username:username}, callback);
}

module.exports.comparePassword = function(candidatePassowrd, hash, callback){
    bcrypt.compare(candidatePassowrd, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback) {
	var query = {
		_id: id
	};
	User.findOne(query, callback);
};
