

var request = require('request');
var datem = require('date-math');

describe("/scav/ns", function(){

      
      var _requestComplete = false; 

      beforeEach(function(){
            _requestComplete = false;
      });


  	it("should return a list of scavs when called without ids",function(){
      
             runs(function(){

                  this._err = null;
                  this._res = null;
                  this._body = null;

                  this.options = 
                  {
                      url: 'http://localhost:3000/scavhn/v1/api/scavs',
                      json: true,
                  };

                  request.get(this.options,function(err,res,body){
                              _err = err;
                              _res = res;
                              _body = body;
                              _requestComplete = true;
                  });
            });

            waitsFor(function(){
                        return _requestComplete;
                  }, "the request to the rest endpoint did not complete within the timeout",5000);
            
            runs(function(){
                  expect(_res).toBeDefined();
                  expect(_body).toBeDefined();
                  expect(_err).toBeDefined();
                  expect(_body.length).toEqual(3);
                  expect(_body[0].name).toEqual('vulture');
                  expect(_body[1].name.length > 0).toBeTruthy();
             });
               
	});


      it("should return the complete vulture game when that id is supplied", function(){
             runs(function(){

                  _err = null;
                  _res = null;
                  _body = null;

                  this.options = 
                  {
                      url: 'http://localhost:3000/scavhn/v1/api/scavs/vulture',
                      json: true
                  };

                  request.get(this.options,function(err,res,body){
                              _err = err;
                              _res = res;
                              _body = body;
                              _requestComplete = true;
                  });
            });

            waitsFor(function(){
                        return _requestComplete;
                  }, "the request to the rest endpoint did not complete within the timeout",5000);
            
            runs(function(){
                  expect(_res).toBeDefined();
                  expect(_body).toBeDefined();
                  expect(_err).toBeDefined();
                  expect(_body.length).toEqual(1);
                  expect(_body[0].name).toEqual('vulture');
                  expect(_body[1].name.length > 0).toBeTruthy();
             });
               
      });

      it("should return a list of items associated with the vulture game", function(){
            runs(function(){

                  _err = null;
                  _res = null;
                  _body = null;

                  _options = 
                  {
                      url: 'http://localhost:3000/scavhn/v1/api/scavs/vulture/items',
                      json: true,
                  };

                  request.get(_options,function(err,res,body){
                              _err = err;
                              _res = res;
                              _body = body;
                              _requestComplete = true;
                  });
            });

            waitsFor(function(){
                        return _requestComplete;
                  }, "the request to the rest endpoint did not complete within the timeout",5000);
            
            runs(function(){
                  expect(_res).toBeDefined();
                  expect(_body).toBeDefined();
                  expect(_err).toBeDefined();
                  expect(_body.length).toEqual(10);
             });
               
      });
    

     
     

});


