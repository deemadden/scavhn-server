var mongoose = require('mongoose'),
	_  = require('underscore'),
	Promise = require('mpromise');
	om = require('../../scavhn/domain/datamodel')(mongoose);

module.exports = (function(mongoose,om){

	mongoose.connect('mongodb://localhost/scavs_dev', function(err){
	var Scav = om.scav();
	var Item = om.item();

	var pscav = function(scavs){

					console.log("inside pscav");

					_.each(scavs,function(dscav){
						console.log("looking for items for scav: " + dscav.name + " level: " + dscav.level);
						Item.find({"level": dscav.level},function(err,items){
							if(err){
                console.log("An error occurred trying to find a level value for a scav.")
							}

							var itemIds = [];
							_.each(items, function(item){ itemIds.push(item._id); });

							Scav.findByIdAndUpdate(dscav._id, {"items": itemIds}, {},function(err, doc){
								if(err){ console.log("there was an error while attempting to update the document" + err);}
								console.log("updated document: " + doc.name + " now has: " + doc.items.length + " items ");
							});
						});
					});
				};

	Scav.find().exec(function(err,scav){
		if(err){
			console.log("exception while attempting to retrieve the scavs");
			return;
		}
	}).then(function(scavs){
		Promise(pscav(scavs)).then(function(err){ mongoose.disconnect();});
	});
});

})(mongoose,om);