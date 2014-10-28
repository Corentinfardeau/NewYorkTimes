'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the newYorkTimesApp
 */
angular
	.module('newYorkTimesApp')
	.controller('LandingCtrl', function ($scope) {

		//Manage animations on landing page
		function animate() {
			var animation={};

			animation.mainTitle=document.getElementsByClassName('landing-title')[0].getElementsByTagName('h1')[0];
			animation.secTitle=document.getElementsByClassName('landing-title')[0].getElementsByTagName('h2')[0];
			animation.discoverBtn=document.getElementsByClassName('landing-discover')[0];

	   	animation.mainTitle.style.opacity = '0';
	   	animation.secTitle.style.opacity = '0';
	   	animation.discoverBtn.style.opacity = '0';

	   	setTimeout(function() {
	   		animation.mainTitle.classList.add('fadeInUp');
	   	},300);

	   	setTimeout(function() {
	   		animation.secTitle.classList.add('fadeInUp');
	   	},500);

	   	setTimeout(function() {
	   		animation.discoverBtn.classList.add('fadeIn');
	   	},1000);
	}

	$scope.$on('$viewContentLoaded', animate);

  });
