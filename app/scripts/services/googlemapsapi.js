'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.googlemapsapi
 * @description
 * # googlemapsapi
 * Service in the newYorkTimesApp.
 */
angular.module('newYorkTimesApp')
  .service('googlemapsapi', function googlemapsapi($rootScope, $http) {
	     
	     /**
         * @ngdoc function
         * @name core.Services.Castrapi#geocode
         * @methodOf core.Services.googlemapsapi
         * @return {object} Returns a promise object
         */
  		this.geocode = function(address, articleId) {
	        
	        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address)
	            .success(function (data, status) {

	                if(data.status === 'OK') {
	                    //articles[key].locationCoordonates = data.results[0].geometry.location;

	                    // MapMarker
	                    var marker = {  
	                        id : articleId,
	                        latitude: data.results[0].geometry.location.lat,
	                        longitude: data.results[0].geometry.location.lng,
	                        //title: articles[key].headline.main,
	                        icon: {
						      path: google.maps.SymbolPath.CIRCLE,
						      scale: 4,
						      strokeColor: '#FFF'
						    }
	                    };

	                    $rootScope.markers.push(marker);
	                }

	            })
	            .error(function (data, status) {

	            });

	 };

  });
