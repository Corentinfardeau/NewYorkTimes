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
    .controller('MainCtrl', function ($rootScope, $scope, $http, $interval, googlemapsapi, apinyt, Config, mobile) {
        
        $scope.popup = false;
        this.socket = io.connect(Config.NODE_SERVER);
        $scope.socket = this.socket;
    
        $scope.sendArticle = function(currentArticle){
			
			
			//Url de la page mobile
			$scope.url_mobile = "http://192.168.0.11/mobile/";
			
            //first connect
            if(!window.localStorage.getItem('token'))
            {	
				$scope.popup = true;
			  	$scope.token = mobile.generateToken();
				window.localStorage.setItem('token', $scope.token);
				
				//create room
				$scope.socket.emit('create room', $scope.token);
                
              //When the mobile join the room, send the currentArticle
			  $scope.socket.on('get firstCurrentArticle', function(data){
                  $scope.socket.emit('send firstCurrentArticle', $scope.token, currentArticle);
				  $rootScope.toggleOverlay('open', 'link');
				  $scope.popup = false;

              });
              
            }
            else
            {
				$scope.socket.emit('send currentArticle', window.localStorage.getItem('token'), currentArticle);
				$scope.token = window.localStorage.getItem('token');
				console.log($scope.popup + "Token deja créé");
            }
            
            
        };
  
        // Error message
        $rootScope.errorMessage = '';
        $rootScope.articles = {};
        $rootScope.markers = [];
        $rootScope.sections = [];

        // Set the map
        $rootScope.map = {
            control: {},
            center: {
                latitude: 0,
                longitude: 0
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

        $scope.showArticle = function(e, article){
			
			//Sound when opening
			var audio = new Audio('../sons/opened.mp3');
			audio.volume=.1;
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

        // Set fullscreen for map
        document.getElementsByClassName('angular-google-map-container')[0].style.height = (window.innerHeight-50)+'px';
        
        var search = function(keywords) {

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
                                .getArticles(search, page);
                            
                            page++;

                        }, 300, count );
                        
                    } else {
                        $rootScope.markers = [];
						$rootScope.errorMessage = 'Aucun article ne correspond à votre recherche.';
                    }
                }); 
            
        };

        search('');
    
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
    
        //apinyt
        //.getArticlesMostShared('sports', '30');
        
        $scope.searchArticles = function() {
            $rootScope.articles = {};
            delete $rootScope.errorMessage;
            $rootScope.sections.length = 0;
            $rootScope.markers = [];
			$rootScope.map.zoom = 3;
            search($scope.keywords);
        };
    
        $scope.toggleFullSearch = function(state) {
            if(state == 'zoomed'){
                document.querySelector('.topBar').style.height='100%';
                document.querySelector('.topBar .btn-close').classList.remove('hidden');
                document.querySelector('.topBar .search').classList.add('zoomed');
                $scope.zoomed = true;
            }else{
                document.querySelector('.topBar').style.height='50px';
                document.querySelector('.topBar .btn-close').classList.add('hidden');
                document.querySelector('.topBar .search').classList.remove('zoomed');
                $scope.zoomed = false;
            }
        };
    
        $rootScope.toggleOverlay = function(state, target) {
            if(state == 'open'){
                switch(target) {
                    case 'landing':
                        document.querySelector('.landing-page').classList.remove('overlay-slide-down--active');
						//Sound when opening
						var audio = new Audio('../sons/carte.mp3');
						audio.volume=.2;
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
            }else{
                switch(target) {
                    case 'landing':
                        document.querySelector('.landing-page').classList.add('overlay-slide-down--active');
                        break;
                    case 'about':
                        document.querySelector('.about-page').classList.add('overlay-slide-down--active');
                        break;
                    case 'link':
                        document.querySelector('.link-page').classList.add('overlay-fade--active');
                        break;
                    default:
                        document.querySelector('.overlay-slide-down').classList.remove('overlay-slide-down--active');
                }
            }
		};
        
		$scope.zoomIn = function() {
			$rootScope.map.zoom += 1;
		};

		$scope.zoomOut = function() {
			if($rootScope.map.zoom > 2){
			   $rootScope.map.zoom -= 1;
            }
		};
});
