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

        // Search submit by hit enter key
        $scope.submit = function() { 
            $scope.articles = [];
            $rootScope.markers = [];
            search($scope.keywords);
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
                latitude: 34.833703,
                longitude: -41.768816
            },
            zoom: 3,
            minZoom: 3,
            options: {
                styles:[{'featureType':'water','elementType':'all','stylers':[{'hue':'#e9ebed'},{'saturation':-78},{'lightness':67},{'visibility':'simplified'}]},{'featureType':'landscape','elementType':'all','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'geometry','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':31},{'visibility':'simplified'}]},{'featureType':'poi','elementType':'all','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'hue':'#e9ebed'},{'saturation':-90},{'lightness':-8},{'visibility':'simplified'}]},{'featureType':'transit','elementType':'all','stylers':[{'hue':'#e9ebed'},{'saturation':10},{'lightness':69},{'visibility':'on'}]},{'featureType':'administrative.locality','elementType':'all','stylers':[{'hue':'#2c2e33'},{'saturation':7},{'lightness':19},{'visibility':'on'}]},{'featureType':'road','elementType':'labels','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':31},{'visibility':'on'}]},{'featureType':'road.arterial','elementType':'labels','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':-2},{'visibility':'simplified'}]}],
                scaleControl:false,
                zoomControl:false,
                streetViewControl:false,
                panControl:false,
                disableDefaultUI: true
            }
        };

        $scope.showArticle = function(e, id){
            $scope.currentArticle = $scope.articles[e!==''?e.key:id];  
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

        $scope.searchArticles = function() {
            document.querySelector('aside-article').classList.add('hidden');
            $rootScope.articles = {};
            $rootScope.sections.length = 0;
            $rootScope.markers = [];
            search($scope.keywords);
        };

});
