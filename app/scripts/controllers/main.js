'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newYorkTimesApp
 */
angular.module('newYorkTimesApp')
  .controller('MainCtrl', function ($scope) {
	
  	var lat;
  	var lng;

	$scope.map = {
		control: {},
		center: {
		latitude: 20,
		longitude: -10
		},
		zoom: 3
	};

	// Set fullscreen for map
	document.getElementsByClassName('angular-google-map-container')[0].style.height = window.innerHeight+'px';

	// User geolocalisation 
  	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			lat = position.coords.latitude;
			lng = position.coords.longitude;
		});
  	}

  });
