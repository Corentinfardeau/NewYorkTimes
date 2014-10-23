'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.googlemapsapi
 * @description
 * # googlemapsapi
 * Service in the newYorkTimesApp.
 */
angular.module('newYorkTimesApp')
  .service('googlemapsapi', function googlemapsapi($http, $q) {
	     
	     /**
         * @ngdoc function
         * @name core.Services.Castrapi#geocode
         * @methodOf core.Services.googlemapsapi
         * @return {object} Returns a promise object
         */
  		this.geocode = function(adress) {
	        
	        var deferred = $q.defer();

	        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+adress)
	            .success(function (data, status) {

	                deferred.resolve(data, status);

	            })
	            .error(function (data, status) {

	                deferred.resolve(data, status);

	            });

	        return deferred.promise;

	 };

  });
