


expoect = require('expect'),
mongoose = require('mongoose'),
om = require('../domain/datamodel')(mongoose);


var _processingComplete = false;

describe("it should return just the item that I need to update", function(){
	



	it('should return the item I need to update and nothing more',function(done){
			mongoose.connect("mongodb://localhost/scavs_dev");
			
			run(function(){

				_items = [];

				var usermodel = mongooose.model('user');
				var query = {'$and': [{'_id': new mongoose.Types.ObjectId('52d42cf440946d041f000003')}
									 ,{'scavs.$.items.$._id': new mongoose.Types.ObjectId('52d0774e058d9c989c769a8c')}]};

				usermodel.find(query,function(err,items){
					_items = items;
					_processingComplete = true;
				});

			});

			waitsFor("processing", function(){ return _processingComplete;});

			run(function(){
				mongoose.disconnect();
				expect(_items).toNotBeNull();
				expect(_items.length).toEqual(1);
				expect(_items[0].name).toEqual('TypeWriter');
			});
	});

});