'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.User
 * @description
 * # User
 * Service in the newYorkTimesApp.
 */
angular.module('newYorkTimesApp')
  .service('User', function User() {
  	
  	this.getUserPosition = function() {

		var userPosition = {};

		if ( navigator.geolocation ) {
			navigator.geolocation.getCurrentPosition(function(position){
				userPosition = position.coords;
			});
		}

		return userPosition;
  	};


  });
