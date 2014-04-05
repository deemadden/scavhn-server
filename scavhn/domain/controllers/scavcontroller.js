var _ = require('underscore'),
	Promise = require('mpromise'),
	Q = require('q');


module.exports = function (mongoose,baucis,om) {

  var scavItemsController = baucis.rest({
    singular: 'item'
    ,publish: false
    ,basePath: '/:_id/items/:itemid?' 
  });

  scavItemsController.query(function (req, res, next) {
    if ((_.isUndefined(req.params.id)) || (_.isNull(req.params.id))) {
      var scav = om.scav();
      scav.find({'name': req.params._id}).exec()
        .then(function (thisscav) {
          var itids = thisscav[0].items.map(function (item) {
            return(item.valueOf());
          });

          req.baucis.query.where('_id').in(itids);
          next();
        })
        .then(undefined,function (err) {
          console.log('error adding parent criteria' + err);
          next(new Error('there was an error adding criteria for scav: ' + req.params._id + "\n" + err));
        }).end();
    } else {
      req.baucis.query.where('_id').equals(req.params.id);
      next();
    }
  });

  var scavController = baucis.rest({
    singular: 'scav'
    ,publish: true
    ,findBy: 'name'
  });

  scavController.use(function(req,res,next){
    console.log('adding CORS');
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', true); 
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    }
    next();
  });

  scavController.documents(function(req,res,next){
    
    var pIdx = 0; //global cb idx
    var idx = 0;
    var docs = null;
    var item = om.item();
    var finalDocs = [];

    if(!Array.isArray(req.baucis.documents)){
        docs = Array(req.baucis.documents);
    }else{
        docs = req.baucis.documents;
    }

    var getStack = function(d){
         
         var itemsIsSelected = false;

         if(req.params.select){
            //select parameter has been submitted
            console.log('select was passed');
            var selectedFields = req.params.select.split(' ');
            selectedFields.forEach(function(s){
                if(s === 'items'){
                    itemsIsSelected = true;
                }
            });

            if(!itemsIsSelected){
              next();
              return;
            }
         }

         
         return d.map(
          function(dd){ 
            var pr = new Promise();
            pr.then(function(doc){
                //console.log('inside onFulfill');
                return {
                  level: doc.level
                  ,idx: idx++
                  ,doc: doc
                  ,items: null
                };
            }).then(function(docObj){
                  var itemIds = docObj.doc.items.map(function(objId){ return objId.valueOf(); });

                  item.find({"_id": {"$in": itemIds}}).exec().then(function(items){

                    console.log('items returned for :' + docObj.level + ' count of: ' + items.length);

                    docObj.items = items;

                    return(docObj);

                  }).then(function(docObj) {
                    var doc = docs[docObj.idx].toObject();
                    delete doc.items;
                    doc.items = docObj.items;
                    finalDocs.push(doc);
                    ++pIdx;
                    if(pIdx === docs.length){
                        req.baucis.documents = finalDocs;
                        next();
                    }
                
                  return pIdx;
                }).then(undefined,function(err){
                   next(new Error('Mongoose issues: ' + err));
                }).end();

            }).then(undefined, function(err){
               console.log(err);
               next(new Error(err));
            }).end();

          pr.fulfill(dd);
          return pr;  
     });
   };


    getStack(docs);

});


  scavItemsController.initialize();
  scavController.use(scavItemsController);

};