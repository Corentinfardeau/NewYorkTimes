'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.googlemapsapi
 * @description
 * # googlemapsapi
 * Service in the newYorkTimesApp.
 */
angular
	.module('newYorkTimesApp')
	.service('googlemapsapi', function googlemapsapi($rootScope, $http, $q) {
	     
	     /**
         * @ngdoc function
         * @name core.Services.Castrapi#geocode
         * @methodOf core.Services.googlemapsapi
         * @return {object} Returns a promise object
         */
  		this.geocode = function(address, section, articleId) {
	        
            var deferred = $q.defer();
            
	        $http
                .get('https://maps.googleapis.com/maps/api/geocode/json?address='+address)
	            .success(function (data) {

	                if(data.status === 'OK') {

	                    var marker = {  
	                        id : articleId,
	                        latitude: data.results[0].geometry.location.lat,
	                        longitude: data.results[0].geometry.location.lng,
	                        section:section,
							options : {},
//                            icon: new google.maps.MarkerImage('images/location.svg', null, null, null, new google.maps.Size(55,55))
	                    };

	                    $rootScope.markers.push(marker);                        
                        deferred.resolve(data.results[0].geometry.location);

	                }

	            })
	            .error(function (data, status) {
                    deferred.resolve(data, status);
	            });
            
            return deferred.promise;

	 };

  });
