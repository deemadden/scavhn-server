
module.exports = function(mongoose){ 

	var ItemSchema = mongoose.Schema({
			label: {type: String}
			,name: {type: String}
			,thumbnail: {type: String}
			,thumbnailType: {type: String}
			,pointValue: {type: String}
			,pointColor: {type: String}
			,hint: {type: String}
			,level: {type: String}
			,coordinates: {
				latitude: {type: Number}
				,longitude: { type: Number}
			}
	});

	var Item = mongoose.model('item',ItemSchema);

	var ScavSchema = mongoose.Schema({
				 	name: {type: String, index: {unique: true}}
				 	,status: {type: String}
				 	,duration: {type: String}
				 	,level: {type: String}
				 	,image: {type: String}
				 	,imageType: {type: String}
				 	,thumbnail: {type: String}
				 	,thumbnailType: {type: String}
				 	,items: {type: [mongoose.Schema.Types.ObjectId], ref: "item"} 
	});


	var Scav = mongoose.model('scav',ScavSchema);


	var UserScavItemSchema = mongoose.Schema({
			label: {type: String}
			,name: {type: String}
			,thumbnail: {type: String}
			,thumbnailType: {type: String}
			,pointValue: {type: String}
			,pointColor: {type: String}
			,hint: {type: String}
			,level: {type: String}
			,status: {type: String}
			,coordinates: {
				latitude: {type: Number}
				,longitude: { type: Number}
			}
	});

	var UserScavItem = mongoose.model('userscavitem', UserScavItemSchema);

	var UserScavSchema = mongoose.Schema({
			name: {type: String, index: {unique: true}} //which game type is this
			,items: {type: [UserScavItemSchema]}
			,expiresOn: {type: Date}
			,status: {type: String}
	});


	var UserSchema  = mongoose.Schema({
			username: {type: String, index: {unique: true}}
			,firstName: {type: String}
			,lastName: {type: String}
			,password: {type: String}
			,scavs: {type: [UserScavSchema]}
	});
	
	var User = mongoose.model('user',UserSchema);  
  	var UserScav = mongoose.model('userscav',UserScavSchema);



	return {
		scav: function(){
			return  Scav;
		},

		item: function() {
			return Item;
		},

		userscav: function(){
			return  UserScav;
		},

		userscavitem: function(){
			return UserScavItem;
		},

		user: function(){
			return User;
		}
	};

};
