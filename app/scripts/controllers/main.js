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
    
        //On ajoute au click l'article courant sur le server
        $scope.sendArticle = function(currentArticle){ 
            currentArticle = this.currentArticle;
            this.socket= io.connect('http://macbook-corentinf.local:2000');
            this.socket.emit('send',currentArticle);
    
            this.socket.on('send token',function(token){
              $scope.token = token;
            });
            //Show the popup with qrcode
            $scope.popup = true;
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
            
			if($rootScope.activeMarker)
				$rootScope.activeMarker.options.animation = 0;
			
			$rootScope.map.center = {latitude: (e!==''?e.position.k:article.coordinates.lat), longitude: (e!==''?e.position.B:article.coordinates.lng)};
            $scope.currentArticle = $scope.articles[e!==''?e.key:article._id];  
            document.querySelector('aside-article').classList.remove('hidden');
			
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
    
        //apinyt
        //.getArticlesMostShared('sports', '30');
        
        $scope.searchArticles = function() {
            document.querySelector('aside-article').classList.add('hidden');
            $rootScope.articles = {};
            delete $rootScope.errorMessage;
            $rootScope.sections.length = 0;
            $rootScope.markers = [];
			$rootScope.map.zoom = 3;
            search($scope.keywords);
        };
    
        $scope.toggleFullSearch = function(state) {
            if(state){
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
        
		$scope.zoomIn = function() {
			$rootScope.map.zoom += 1;
		};

		$scope.zoomOut = function() {
			if($rootScope.map.zoom > 2){
			   $rootScope.map.zoom -= 1;
            }
		};
});
