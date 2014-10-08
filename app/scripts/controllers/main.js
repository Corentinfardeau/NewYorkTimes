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
  	$scope.position = {};
  	$scope.position.latitude = 48.8689088;
	$scope.position.longitude =  2.4502272;

	$scope.map = {
		control: {},
		center: {
		latitude: 20,
		longitude: -10
		},
		zoom: 3,
		options: {
			styles:[{'featureType':'landscape','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'stylers':[{'hue':'#00aaff'},{'saturation':-100},{'gamma':2.15},{'lightness':12}]},{'featureType':'road','elementType':'labels.text.fill','stylers':[{'visibility':'on'},{'lightness':24}]},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':57}]}],
			panControl:false,
			scaleControl:false,
			zoomControl:false,
			streetViewControl:false
		}
	};

	// Set fullscreen for map
	document.getElementsByClassName('angular-google-map-container')[0].style.height = window.innerHeight+'px';

	// User geolocalisation 
  	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			$scope.refreshMap(lat,lng,14);
		});
  	}

  	$scope.refreshMap = function (lat, lng, zoom) {
    	//optional param if you want to refresh you can pass null undefined or false or empty arg
	    $scope.map.control.refresh({latitude: lat, longitude: lng});
	    $scope.map.control.getGMap().setZoom(zoom);
	    return;
  	};

  });
