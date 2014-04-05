


module.exports = function(mongoose){
	

	/*
	 * reutrns the user scav item associated with the user and scav passed in
	 * assumes the user,scavname,scavitemId are not null
	 **/
	var findUserScavItem = function(user, svacname, scavitemId){
		user.scavs.forEach(function(scav){
			if(scav.name === scavname){
				scav.items.forEach(function(item){
					if(item._id === scavitemId){
						return(item);
                    }
				});
			}
		});

		return null; //if you get here it didn't find the scav
	};


	return{
		findUserScavItem: findUserScavItem
	};

};