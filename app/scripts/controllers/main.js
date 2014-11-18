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
    .controller('MainCtrl', function ($rootScope, $scope, $http, $interval, googlemapsapi, apinyt, Config) {

        // Error message
        $rootScope.errorMessage = '';

        $rootScope.articles = {};
        $rootScope.markers = [];
        $rootScope.sections = [];

        // Set the map
        $rootScope.map = {
            control: {},
            center: {
                latitude: 34.833703,
                longitude: -41.768816
            },
            zoom: 4,
            minZoom: 4,
            options: {
                styles:Config.GMAP_STYLE,
                scaleControl:false,
                zoomControl:false,
                streetViewControl:false,
                panControl:false,
                disableDefaultUI: true
            }
        };

        $scope.showArticle = function(e, article){
            $rootScope.map.center = {latitude: (e!==''?e.position.k:article.coordinates.lat) - 0.2, longitude: (e!==''?e.position.B:article.coordinates.lng) + 0.7};
           // $rootScope.map.zoom = 6;
            $scope.currentArticle = $scope.articles[e!==''?e.key:article._id];  
            document.querySelector('aside-article').classList.remove('hidden');    
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
                        $rootScope.errorMessage = 'Aucun article ne correspond à votre recherche.';
                    }
                }); 
            
        };

        search('');
    
        //apinyt.getArticlesMostShared('sports', '30');
        
        $scope.searchArticles = function() {
            document.querySelector('aside-article').classList.add('hidden');
            $rootScope.articles = {};
            delete $rootScope.errorMessage;
            $rootScope.sections.length = 0;
            $rootScope.markers = [];
            search($scope.keywords);
        };
    
        var zoomed = false;
	
        $scope.fullSearch = function(state) {
            if(!state){
                document.querySelector('.topBar').style.height='100%';
                document.querySelector('.topBar .btn-close').classList.toggle('hidden');
                document.querySelector('.topBar .search').classList.toggle('zoomed');
            }
            zoomed = true;
        };
        
        $scope.closeFullSearch = function() {
            zoomed = false;
            
            document.querySelector('.topBar').style.height='50px';
            document.querySelector('.topBar .btn-close').classList.toggle('hidden');
            document.querySelector('.topBar .search').classList.toggle('zoomed');
        };
});
