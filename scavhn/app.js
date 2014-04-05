
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var baucis = require('baucis'),
	mongoose = require('mongoose'),
	om = require('./domain/datamodel')(mongoose);

var app = express();
var	rest = require('./domain/rest')(mongoose,baucis,om,app);



function cors(req,res,next){
		
		res.header('Access-Control-Allow-Origin', '*');
  		res.header('Access-Control-Allow-Credentials', true); 
  		res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  		res.header('Access-Control-Allow-Headers', 'Content-Type');
		
		if(req.method === 'OPTIONS'){
				res.end(); 
		}else{
		  		next();
		}

}

//TODO: externalize the mongo connection string...possibly env variable?
mongoose.connect('mongodb://localhost/scavs_dev');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(cors);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use('/scavhn/v1/api/',baucis({swagger: true}));


app.use(express.static(path.join(__dirname, 'public')));
//required if you use ajax from the mobile
app.enable("jsonp callback");

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

/*app.options('*', function(req,res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true); 
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
});*/


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
