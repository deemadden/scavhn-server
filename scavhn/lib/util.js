module.exports=(function(){

	Number.prototype.toRad = function() {
   		return this * Math.PI / 180;
	}



  function toRad(val){
    return val * Math.PI / 180;
  }

//	var calc = function(lat1,lon1, lat2,long2){
//
//		var R = 6371; // km
//		//has a problem with the .toRad() method below.
//		var x1 = lat2-lat1;
//		var dLat = x1.toRad();
//		var x2 = lon2-lon1;
//		var dLon = x2.toRad();
//		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//        	    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
//           		Math.sin(dLon/2) * Math.sin(dLon/2);
//		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//		var d = R * c;
//		return(d);
//	};

	return{
		calculateDistance: function(lat1,lon1, lat2, lon2) {

      console.log('calculateDistance called.', lat1, lon1, lat2, lon2);

      var R = 6371; // km
      //has a problem with the .toRad() method below.
      var x1 = lat2-lat1;
      //var dLat = x1.toRad();
      var dLat = toRad(x1);
      var x2 = lon2-lon1;
      //var dLon = x2.toRad();
      var dLon = toRad(x2);
      
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos( toRad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      return(d);
    }
	};
})();