var  _ = require('underscore'),
         Q = require('q')
         ,util = require('../../lib/util')
         ,game = require('../../lib/game');

module.exports = function(mongoose,baucis,om,app){

  var userController = baucis.rest({
      singular: 'user'
      ,publish: true
      ,findBy: 'username'
      ,basePath: '/:username'
  });


  userController.param('username',function(req,res,next){
      om.user().findOne({'username': req.params.username}, function(err,user){
          if(err){ next(new Error(err)); }
          if((_.isNull(user)) || (_.isUndefined(user))){
              next(new Error('cannot locate a user with username: ' + req.params.username));
          }else{
              //console.log('adding a user: ' + user.username + 'to request');
              req.user = user;
              next();
          }
      });
  });

  userController.param('scavname', function(req,res,next){
      om.scav().findOne({'name': req.params.scavname},function(err,scav){
          if(err){ next(new Error(err));}
          req.scav = scav;
          var itemids = scav.items.map(function(s){ return(s.valueOf()); });
          om.item().find({'_id': {'$in': itemids}},function(err,items){

              if(err){ next(new Error(err)); }
              delete req.scav.items;
              req.scav.items = items;
              next();
          });
      });
  });

  userController.param('userscavid', function(req,res,next){
      if((_.isUndefined(req.params.username) || (_.isNull(req.params.username)))){
          next(); //no username parameter
      }else{
          om.user().findOne({'username': req.params.username}, function(err,user){
            if(err){ next(new Error(err)); }
    
            if((_.isNull(user)) || (_.isUndefined(user))){
                next(new Error('cannot locate a user with username: ' + req.params.username));
            }else{
                //console.log('adding a user: ' + user.username + 'to request');
                req.user = user;
                var userscavs = user.scavs;
                userscavs.forEach(function(scav){
                  console.log('looking for a scav: ' + req.params.userscavid + '\n evaluating:' + scav._id.valueOf());
                  if(scav._id.valueOf() == req.params.userscavid){
                      console.log('they match, assigning scav: ' + scav._id);
                      req.scav = scav;
                  }else{
                      console.log('they don\'t match');
                  }
                });
              next();
            }
          });
      } //end findONe

  });


  userController.get('/:username/scavs', function(req,res,next){
        res.json(200,req.user.scavs);
  });

  userController.get('/:username/scavs/:scavname', function(req,res,next){
    var returnedScav = null;

    req.user.scavs.forEach(function(d){
      if(d.name === req.scav.name){
        returnedScav = d;
      }
    });

    if((_.isUndefined(returnedScav)) || (_.isNull(returnedScav))){
      res.json(404,"{error: 'user does not have that scav");
      res.end();
    }else{
      res.json(returnedScav);
    }
  });



  userController.get('/:username/scavs', function(req,res,next){
      res.json(req.user.scavs);
  });


  userController.put('/:username/scavs/:userscavid/items/:userscavitemid',function(req,res,next){

        if(_.isUndefined(req.params.userscavitemid) || _.isNull(req.params.userscavitemid)){
            next(new Error("no scav item id was present on the request"));
        }else{
            //find the scav item id
            //validate the body
            console.log('\n\nname: ' + req.body.scavItemName);
            console.log("body: ");
            console.dir(req.body);
            
            if(_.isNull(req.body.coordinates) || (_.isUndefined(req.body.coordinates))){
                //TODO: firm up on the structure of the Error responses
                res.json(500,{'error': { 'message': 'the coordinates were not found in the request body'}});
            }

            if(req.body.scavItemName == 'Lego House'){
              //TODO: firm up on the structure of the Error responses
              res.json(500,{'error': { 'message': 'You hit the bad seed.  Lego House can never be found!'}});
            }

            var userCoordinates = req.body.coordinates;
            req.user.scavs.forEach(function(scav){
                //console.log('looking for scav: ' + scav._id.valueOf() + ' comparing against: ' + req.params.userscavid);
                if(scav._id.valueOf() == req.params.userscavid){
                    scav.items.forEach(function(item){
                        //console.log('looking for item: ' + req.params.userscavitemid + ' comparing against: ' + item._id.valueOf());
                if(item._id.valueOf() == req.params.userscavitemid){

                    console.log('calculating distance for item: ' + item.name);

                       var metersFromTarget = util.calculateDistance(userCoordinates.latitude,
                                                                     userCoordinates.longitude,
                                                                          item.coordinates.latitude,
                                                                          item.coordinates.longitude);


                       console.log('meters from target: ' + metersFromTarget);

                       item.status = "FOUND";
                    }
                  });
                }
            });

            req.user.save(function(err,user){

               if(err){
                   res.json(500,{'error': {'message': err}});
               }else{
                   user.scavs.forEach(function(scav){
                       if(scav._id.valueOf() == req.params.userscavid){
                           scav.items.forEach(function(item){
                               if(item._id.valueOf() == req.params.userscavitemid){
                                    res.json(200,item);
                               }
                           });
                       }
                   });
               }
            });
        }

  });





  userController.post('/:username/scavs/:scavname', function(req,res,next){

          console.log('adding user scav to: ' + req.user.username + ' scavname: ' + req.scav.name);

          var newuserscav = {};
          newuserscav.status = "INPROGRESS";
          newuserscav.name = req.scav.name;
          newuserscav.items = [];


          var perror = function(err){
            res.json(500, {'error': { 'message': err}});
          };

          
          var validate = function(cb){
              om.user().findById(req.user._id.valueOf())
              .exec()
              .then(function(user){
                  idx =0;
                  usermod = false;
                  
                  user.scavs.forEach(function(scav){
                    
                    if(scav.name === req.scav.name){
                      console.log('user: ' + user.username + ' already has a scav associated with them for: ' + scav.name);
                      delete user.scavs[idx];
                      usermod = true;
                    }

                    ++idx;
                    if(usermod === true){
                      console.log('reset the scav...saving user data');
                      user.save(function(err,user){ if(err){ perror(err);} });
                    }

                  });

                  cb();
              }).then(undefined,perror).end();
          };


          var saveUser = function(user){
              user.save(function(err,user){
                  if(err) {
                    perror(err);
                  }

                  //res.json(200,newuserscav);
                  res.json(200,{'name': newuserscav.name});
              });
          };


          var addItemsToUserScav = function(user){
               var itemids = req.scav.items.map(function(s){ return(s.valueOf())});
                om.item().find({'_id':{'$in': itemids}})
                        .exec()
                        .then(function(items){
                                  items.forEach(function(item){
                                  userscavitem = {};
                                  userscavitem.coordinates = {};
                                  userscavitem.name = item.name;
                                  userscavitem.pointValue = item.pointValue;
                                  userscavitem.pointColor = item.pointColor;
                                  userscavitem.hint = item.hint;
                                  userscavitem.level = item.level;
                                  userscavitem.thumbnail = item.thumbnail;
                                  userscavitem.thumbnailType = item.thumbnailType;
                                  userscavitem.coordinates = { latitude: item.coordinates['latitude'], longitude: item.coordinates['longitude'] };
                                  userscavitem.status = "ACTIVE";
                                  //TODO: investigate why the _id is not being generated.
                                  userscavitem._id = item._id.valueOf();
                                  newuserscav.items.push(userscavitem);
                            });
    
                            user.scavs.push(newuserscav);
                            return(user);
                        }).then(saveUser)
                        .then(undefined,perror)
                        .end();
          };


          validate(function(){
                om.user().findById(req.user._id.valueOf())
                         .exec()
                         .then(addItemsToUserScav)
                         .then(undefined, perror).end();
          });
          
  });
} 

