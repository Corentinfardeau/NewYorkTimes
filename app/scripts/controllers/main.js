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
    .controller('MainCtrl', function ($rootScope, $scope, $http, $interval, googlemapsapi, apinyt) {

        // Search submit by hit enter key
        $scope.submit = function() { 
            $scope.articles = [];
            $rootScope.markers = [];
            search($scope.keywords);
        };

        // Error message
        $rootScope.errorMessage = '';

        $scope.articles = [];
        $rootScope.markers = [];
        $scope.sections = [];

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

        $scope.showArticle = function(e){
            $scope.currentArticle = $scope.articles[e.key];  
            document.querySelector('aside-article').classList.remove('hidden');
            
        };

        // Set fullscreen for map
        document.getElementsByClassName('angular-google-map-container')[0].style.height = window.innerHeight+'px';
        
        var search = function(keywords) {

        var search = keywords ? keywords : '';
        var requestsLimit = 15;

        apinyt
        .getNbArticles(search)
        .then(function(data) {
            if (data.response !== null) {
                var pages = data.response.meta.hits/10;
                var count = pages<requestsLimit ? pages : requestsLimit;

                var page = 1;

                $interval(function(){

                            apinyt
                            .getArticles(search, page)
                            .then(function (data) {

                                if (data !== null) {

                                    if (data.response !== undefined) {
                                        
                                        angular.forEach(data.response.docs, function(value){

                                            if($scope.sections.indexOf(value.section_name) === -1) {
                                                $scope.sections.push(value.section_name);
                                            }

                                            angular.forEach(value.keywords, function(v){
                                                var c = 0;
                                                if( v.name==='glocations' ) {
                                                    if(c === 0) {
                                                        value.location = v.value;
                                                        value.pub_date = value.pub_date.split('T')[0];
                                                        $scope.articles[value._id] = value;
                                                        googlemapsapi.geocode(value.location, value.section_name, value._id);
                                                    }
                                                    else {
                                                        var clone = value.slice();
                                                        clone.location = v.value;
                                                        clone.pub_date = clone.pub_date.split('T')[0];
                                                        googlemapsapi.geocode(clone.location, value.section_name, clone._id);
                                                    }
                                                    c++;
                                                }

                                            });

                                        });


                                    } else {

                                        $rootScope.errorMessage = 'Sorry, the server respond with a error.';

                                    }

                                } else {

                                        $rootScope.errorMessage = 'Sorry, the server doesnt respond.';

                                }

                            });
                    page++;

                    }, 300, count);

            } else {
                $rootScope.errorMessage = 'Sorry, the server doesnt respond.';
            }
        }); 
        };

        search('');

        $scope.searchArticles = function(){
            document.querySelector('aside-article').classList.add('hidden');
            $scope.articles = [];
            $scope.sections.length = 0;
            $rootScope.markers = [];
            search($scope.keywords);
        };


        $scope.sectionsManage = function() {
        };
});
