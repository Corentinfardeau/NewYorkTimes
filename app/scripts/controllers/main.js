'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newYorkTimesApp
 */
angular
    .module('newYorkTimesApp')
    .controller('MainCtrl', function ($rootScope, $scope, $http, $filter , $interval, googlemapsapi, apinyt, Config, mobile, apiTwitter, $location) {
 		
		$scope.removeArticles = [];
		$scope.removeMarkers  = [];
		$scope.messageMobile = 'Save to mobile';
		$rootScope.sectionsChecked= [];
		$rootScope.errorMessage = '';
		$rootScope.articles = {};
		$rootScope.markers = [];
		$rootScope.sections = [];
		$rootScope.markersDisplayed = [];

		if (screen.width <= 800) {
			$location.path('/mobile');
		}

		this.socket = io.connect( Config.NODE_SERVER );
		$scope.socket = this.socket;

		if(window.localStorage.getItem('token'))
		{
			$scope.socket.emit('join room', window.localStorage.getItem('token'));
		}

		// Function to send an article to mobile
		$scope.sendArticle = function (currentArticle) {

		$scope.urlMobile = Config.APP_URL+'/#/mobile/';

		// First connect
		if(!window.localStorage.getItem('token'))
		{	
			$scope.token = mobile.generateToken();

			// Create room
			$scope.socket.emit('create room', $scope.token);

			//If success
			$scope.socket.on('success joined',function(data){
				window.localStorage.setItem('token', $scope.token);
				document.querySelector('.link-page').parentNode.removeChild(document.querySelector('.link-page'));
			});

			// When the mobile join the room, send the currentArticle
			$scope.socket.on('get firstCurrentArticle', function() {
			$scope.socket.emit('send firstCurrentArticle', $scope.token, currentArticle);

		  });

			//When article is added to mobile
			$scope.socket.on('add firstArticle', function(article){
					$scope.messageMobile = 'Saved';
					document.getElementsByClassName('button-bar')[0].classList.add('button-bar--active');
					//Sound when is saved
					var audio = new Audio('../sons/beep.wav');
					audio.volume=0.1;
					audio.play();
					$scope.$apply();
			});

		}
		else
		{
			$scope.token = window.localStorage.getItem('token');

			//Remove the popup with the QRCODE
			if(document.querySelector('.link-page')){
				document.querySelector('.link-page').parentNode.removeChild(document.querySelector('.link-page'));
			}

			$scope.socket.emit('send currentArticle', window.localStorage.getItem('token'), currentArticle);

			//When article is added to mobile
			$scope.socket.on('add article', function(article){
				$scope.messageMobile = 'Saved';
				document.getElementsByClassName('button-bar')[0].classList.add('button-bar--active');
				//Sound when is saved
				var audio = new Audio('../sons/beep.wav');
				audio.volume=0.1;
				audio.play();
				$scope.$apply();
			});

		}


		};

		// MAP CONFIGURATION
		$rootScope.map = {
		control: {},
		center: {
			latitude: 39.419221,
			longitude: -3.515625
		},
		zoom: 3,
		minZoom: 3,
		noClear:true,
		options: {
			styles:Config.GMAP_STYLE,
			scaleControl:false,
			zoomControl:false,
			scrollwheel : false,
			streetViewControl:false,
			panControl:false,
			disableDefaultUI: true
		}
		};

		// Function to show an article on the right side
		$scope.showArticle = function(e, article){

		//Watch if the article is saved
		$scope.socket.emit('isSaved', window.localStorage.getItem('token'));
		document.querySelector('.info-bar').classList.add('hidden');
		$scope.socket.on('getAllArticlesSaved', function(savedArticles){
			for(var i = 0; i < savedArticles.length; i++){
				if(savedArticles[i]._id === article._id){
					$scope.messageMobile = 'Saved';
					document.getElementsByClassName('button-bar')[0].classList.add('button-bar--active');
					break;
				}
				else{
					$scope.messageMobile = 'Save to mobile';
					document.getElementsByClassName('button-bar')[0].classList.remove('button-bar--active');
				}
			}
		});

		// Sound when opening
		var audio = new Audio('../sons/opened.mp3');
		audio.volume=0.1;
		audio.play();

		if($rootScope.activeMarker) {
			$rootScope.activeMarker.options.animation = 0;
		}

		$rootScope.map.center = {latitude: (e!==''?e.position.k:article.coordinates.lat), longitude: (e!==''?e.position.B:article.coordinates.lng)};
		$scope.currentArticle = $scope.articles[e!==''?e.key:article._id];  

		document.querySelector('aside-article').classList.add('aside--halfActive');

		for(var i=0 ; i < $rootScope.markers.length ; i++) {
			var id = (e!==''?e.key:article._id);
			if($rootScope.markers[i].id === id) {
				$rootScope.markers[i].options.animation = google.maps.Animation.BOUNCE;
				$rootScope.activeMarker = $rootScope.markers[i];
				return;
			}
		}
		};

		// UI 
		var mapDiv = document.getElementsByClassName('angular-google-map-container')[0];
		mapDiv.style.height = (window.innerHeight-50)+'px';

		function resizeMap() {
		mapDiv.style.height = (window.innerHeight-50)+'px';
		}

		document.addEventListener('DOMContentLoaded', resizeMap, false);
		window.onresize = resizeMap;

		// SEARCH FUNCTION
		var search = function(keywords, begin, end) {

		$rootScope.articles = {};
		$rootScope.errorMessage = '';
		$rootScope.sections = [];
		$rootScope.map.zoom = 3;

		for(var i=0; i<$rootScope.markers.length; i++){
			$rootScope.markers[i].options.visible = false;
		}

		$rootScope.markers = [];

		var search = keywords ? keywords : '';

		apinyt
			.getNbArticles(search)
			.then(function(nbArticles) {

				if (nbArticles !== 0) {
					var pages = nbArticles/10;
					var count = pages<Config.REQUESTS_LIMIT ? pages : Config.REQUESTS_LIMIT;
					var page = 1;

					$interval( function() { 

						apinyt
							.getArticles(search, page, begin, end);

						page++;

					}, 300, count );

				} else {
					$rootScope.markers = [];
					$rootScope.errorMessage = 'Aucun article ne correspond à votre recherche.';
				}
			});



		};

		// Manage function
		function animate() {
		var animation = {};

		animation.mainTitle=document.getElementsByClassName('landing-title')[0].getElementsByTagName('h1')[0];
		animation.secTitle=document.getElementsByClassName('landing-title')[0].getElementsByTagName('h2')[0];
		animation.discoverBtn=document.getElementsByClassName('landing-discover')[0];

		animation.mainTitle.style.opacity = '0';
		animation.secTitle.style.opacity = '0';
		animation.discoverBtn.style.opacity = '0';

		setTimeout(function() {
			animation.mainTitle.classList.add('fadeInUp');
		}, 400);

		setTimeout(function() {
			animation.secTitle.classList.add('fadeInUp');
		}, 600);

		setTimeout(function() {
			animation.discoverBtn.classList.add('fadeIn');
		}, 1100);
		}

		$scope.$on('$viewContentLoaded', function(){
		animate();
		});

		// Search function
		$scope.searchArticles = function() {
		search($scope.keywords);
		};

		// Array of the periods
		$scope.searchPeriods = [
		{ id: 'all',    name: 'All time' },
		{ id: 'week',   name: 'Last week' },
		{ id: 'month',  name: 'Last month' },
		{ id: 'year',   name: 'Last year' }
		];

		// Show / Hide the search page
		$scope.toggleFullSearch = function(state) {
		if(state === 'zoomed'){
			document.querySelector('.info-bar').classList.add('hidden');
			document.querySelector('.search-period').classList.add('hidden');
			document.querySelector('.topBar').style.height='100%';
			document.querySelector('.topBar .btn-close').classList.remove('hidden');
			document.querySelector('.topBar .search').classList.add('zoomed');
			$scope.zoomed = true;
		}else{
			document.querySelector('.search-period').classList.remove('hidden');
			document.querySelector('.topBar').style.height='50px';
			document.querySelector('.topBar .btn-close').classList.add('hidden');
			document.querySelector('.topBar .search').classList.remove('zoomed');
			$scope.zoomed = false;
		}
		};

		// Close the info bar
		$scope.closeInfoBar = function() {
		document.querySelector('.info-bar').classList.add('hidden');
		}

		// Manage animations
		$rootScope.toggleOverlay = function(state, target) {
		if(state === 'open') {
			switch(target) {
				case 'landing':
					document.querySelector('.landing-page').classList.remove('overlay-slide-down--active');

					//Sound when opening
					var audio = new Audio('../sons/carte.mp3');
					audio.volume=0.2;
					audio.play();

					break;
				case 'about':
					document.querySelector('.about-page').classList.remove('overlay-slide-down--active');
					break;
				case 'link':
					document.querySelector('.link-page').classList.remove('overlay-fade--active');
					break;
				default:
					document.querySelector('.overlay-slide-down').classList.remove('overlay-slide-down--active');
			}
		} else {
			switch(target) {
				case 'landing':
					document.querySelector('.landing-page').classList.add('overlay-slide-down--active');
					break;
				case 'about':
					document.querySelector('.about-page').classList.add('overlay-slide-down--active');
					break;
				case 'link':
					if(document.querySelector('.link-page')){
						document.querySelector('.link-page').classList.add('overlay-fade--active');	
					}
					break;
				default:
					document.querySelector('.overlay-slide-down').classList.remove('overlay-slide-down--active');
			}
		}
		};

		// Manage zoom in / zoom out on the map
		$scope.zoomIn = function() {
			$rootScope.map.zoom += 1;
		};

		$scope.zoomOut = function() {
			if($rootScope.map.zoom > 2) {
			   $rootScope.map.zoom -= 1;
			}
		};

		// Get the most shared articles of NYT
		apinyt
			.getArticlesMostShared( 'all-sections', 1 )
			.then(function(mostShared) {
				$scope.articlesMostShared = mostShared;
			});

		// Get the popular articles of NYT
		apinyt
			.getPopularArticles( 'all-sections', 1, 'mostviewed' )
			.then(function(mostViewed) {
				$scope.articlesMostViewed = mostViewed;
			});

		// Manage the filter of sections
		$scope.$watch( 'sectionsChecked', function() {

		for ( var i=0 ; i<$rootScope.markersDisplayed.length ; i++ ) {
			$rootScope.markersDisplayed[i].options.visible = false;
		}

		$rootScope.markersDisplayed = [];

		for (var k = 0 ; k < $rootScope.sectionsChecked.length ; k++ ) {

			var markersFiltered = $filter('filter')($rootScope.markers , $rootScope.sectionsChecked[k]);
			
			for( var j=0; j < markersFiltered.length ; j++ ) { 
				$rootScope.markersDisplayed.push( markersFiltered[j] );
			}

		}

		for ( var l = 0 ; l < $rootScope.markersDisplayed.length ; l++ ) {
			$rootScope.markersDisplayed[l].options.visible = true;
		}


		} , true );

		// Get last tweets from keywords 'The new york times'
		apiTwitter
			.getRelatedTweets('The new york times')
			.then(function(tweets) {
			$scope.relatedTweets = tweets;
		});

		// Manage the filtering by period
		$scope.$watch( 'searchPeriod' , function() {

		var period = $scope.searchPeriod.id;

		var s = '';
		if($scope.keywords !== undefined) {
			s = $scope.keywords;
		}

		var today = new Date();

		switch(period) {
		case 'month':
			var last_month = new Date(today.getFullYear(),today.getMonth()-2,0);
			var day = last_month.getDate();
			if(day < 10) {
				day = '0'+day;
			}
			var month = last_month.getMonth();
			if(month < 10) {
				month = '0'+month;
			}
			var end = ''+last_month.getFullYear()+month+day;

			search(s, '', end);
			break;
		case 'week':
			var last_week = new Date(today.getFullYear(),today.getMonth()-1,0);
			var day = last_week.getDate();
			if(day < 10) {
				day = '0'+day;
			}
			var month = last_week.getMonth();
			if(month < 10) {
				month = '0'+month;
			}
			var end = ''+last_week.getFullYear()+month+day;

			search(s, '', end);
			break;
		case 'year':
			var year = new Date()
			var day = year.getDay();
			if(day < 10) {
				day = '0'+day;
			}
			var month = year.getMonth();
			if(month < 10) {
				month = '0'+month;
			}
			var end = ''+(year.getFullYear()-1)+month+day;

			search(s, '', end);
			break;
		}
		});

		// Update tweets switch our search
		$scope.$watch( 'keywords' , function() {
			apiTwitter
			.getRelatedTweets($scope.keywords)
			.then(function(tweets) {
				$scope.relatedTweets = tweets;
			});
		});

		// INITIAL SEARCH
		search('', '', '');

});
