var _ = require('underscore'),
	promise = require('mpromise'),
	mongoose = require('mongoose'),
	om = require('../domain/datamodel')(mongoose),
	request = require('request');



describe("provides information and interactions with user data",function(){

	  var _requestComplete = false;
    var user = null;
    var item = null;
    var scav = null;

      console.log('is this going to run?');

      beforeEach(function(){
            _requestComplete = false;
            mongoose.connect('mongodb://localhost/scavs_dev');
            om.user().findOne({'username': 'timmypickens'}, function(err,timmy){
                  user = timmy;
                  user.scav =
                  item = timmy.scavs[0].
            });
      });

      afterEach(function(){
      		mongoose.disconnect();
      });


 	it("should accept a game id and create a scav for that user", function(){

            runs(function(){
                  
                  _res = null;
                  _err = null;
                  _body = null;

                  d = new Date();
                  
                  _options = 
                  {
                      url: 'http://localhost:3000/scavhn/v1/api/users/timmypickmen/vulture',
                      json: true,
                      body: {status: 'BEGIN', duration: '4hrs'}
                  };

                  request.post(_options, function(err,res,body){
                              _res = res;
                              _err = err;
                              _body = body;
                  });
            });


            waitsFor(function(){ return _requestComplete;}, "the rest endpoint failed or timedout", 5000);

            runs(function(){

            	  
            	  var userModel = om.user();
            	  userModel.find({'username': {'$eq': 'timmypickmen'}})
            	  		.exec()
            	  		.then(function(user){
            	  			expect(user).not.toBeNull();
            	  			expect(user.scavs).toBeDefined();
            	  			expect(user.scavs.length).toBeGreaterThan(0);
            	  			expect(user.scavs[0].name).toEqual('vulture');
            	  			expect(user.scavs[0].status).toBeEqual('INPROGRESS');
            	  		}).then(undefined, function(err){
            	  			fail('un handled error while executing spec ' + err);
            	  		}).end();

                  expect(_res).toBeDefined();
                  expect(_res.statusCode).toEqual(200);
            });
     });

 	it("should accept a game id and create a scav for that user", function(){

            runs(function(){
                  
                  _res = null;
                  _err = null;
                  _body = null;

                  d = new Date();
                  
                  _options = 
                  {
                      url: 'http://localhost:3000/scavhn/v1/api/users/timmypickmen/vulture',
                      json: true,
                      body: {status: 'BEGIN', duration: '4hrs'}
                  };

                  
                  request.post(_options, function(err,res,body){
                              _res = res;
                              _err = err;
                              _body = body;
                  });
            });


            waitsFor(function(){ return _requestComplete;}, "the rest endpoint failed or timedout", 5000);

            runs(function(){
                  expect(_res).toBeDefined();
                  expect(_res.statusCode).toEqual(200);
            });
     });



	it("should return timmypickmen's information when you hit the /user/timmypickmen resource", function(){
            runs(function(){
                  _options = {
                        uri: "http://localhost:3000/scavhn/v1/api/users/timmypickmen",
                        method: 'GET',
                        json: true,
                  }

                
                  request(_options,function(err,res,body){
                        _err = err;
                        _res = res;
                        _body = body;
                  });

            });

            waitsFor(function() { return _requestComplete; }, "the rest endpoint failed or timedout",5000);

            runs(function(){
                  expect(_res).toBeDefined();
                  expect(_body).toBeDefined();
                  expect(_err).toBeDefined();
            });

    });


     it("should accept lat, long, and heading add that to the players list of found items", function(){


            
            run(function(){
            	_options = 
            	{
                      url: 'http://localhost:3000/scavhn/v1/api/users/timmypickmen/vulture/items/' + item._id,
                      json: true,
                      body: {'coordinates': {'latitude': -10002300.00, 'longitude': 102002003}};
            	};      

              _err = null;
              _res = null;
              _body = null;

            
            	request.put(options, function(err,res,body){
                      _err = err;
                        _res = res;
                        _body = body;          	
            	});
            });


            waitsFor(function() { return _requestComplete;}, "the rest endpoint failed or timedout",5000);


            run(function(){
                 expect(_res).to.have.property(200);
            });

      });

});