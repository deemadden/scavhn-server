var  _ = require('underscore'),
    Promise = require('mpromise');


module.exports = function(mongoose,baucis,om,app){
    /**
     * import controllers...just to break things up a little
     **/
    require('./controllers/scavcontroller.js')(mongoose,baucis,om);
    require('./controllers/usercontroller.js')(mongoose,baucis,om,app);
};




