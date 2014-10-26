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

        // Error message
        $rootScope.errorMessage = '';

        $scope.articles = [];
        $rootScope.markers = [];

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
                styles:[{'featureType':'landscape','stylers':[{'saturation':-100},{'lightness':65},{'visibility':'on'}]},{'featureType':'poi','stylers':[{'saturation':-100},{'lightness':51},{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'road.arterial','stylers':[{'saturation':-100},{'lightness':30},{'visibility':'on'}]},{'featureType':'road.local','stylers':[{'saturation':-100},{'lightness':40},{'visibility':'on'}]},{'featureType':'transit','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'administrative.province','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':-25},{'saturation':-100}]},{'featureType':'water','elementType':'geometry','stylers':[{'hue':'#ffff00'},{'lightness':-25},{'saturation':-97}]}],
                panControl:false,
                scaleControl:false,
                zoomControl:false,
                streetViewControl:false
            }
        };


        $scope.showArticle = function(e){
            $scope.currentArticle = $scope.articles[e.key];
        };

        $scope.hideArticle = function(e) {
            e.preventDefault();
            alert('cool');
            $scope.currentArticle = null;
        };

        // Set fullscreen for map
        document.getElementsByClassName('angular-google-map-container')[0].style.height = window.innerHeight+'px';
        
        var search = function(keywords) {

        var search = keywords ? keywords : '';
        var requestsLimit = 30;

        apinyt
        .getNbArticles(search)
        .then(function(data) {
            if (data.response !== null) {
                var pages = data.response.meta.hits/10;
                var count = pages<requestsLimit ? pages : requestsLimit;

                var page = 1;

                // for(var page=1; page<count+1; page++) {
                $interval(function(){

                            apinyt
                            .getArticles(search, page)
                            .then(function (data) {

                                if (data !== null) {

                                    if (data.response !== undefined) {
                                        
                                        angular.forEach(data.response.docs, function(value){

                                            angular.forEach(value.keywords, function(v){
                                                var c = 0;
                                                if( v.name==='glocations' ) {
                                                    if(c === 0) {
                                                        value.location = v.value;
                                                        $scope.articles[value._id] = value;
                                                        googlemapsapi.geocode(value.location, value._id);
                                                    }
                                                    else {
                                                        var clone = value.slice();
                                                        clone.location = v.value;
                                                        googlemapsapi.geocode(clone.location, clone._id);

                                                    }
                                                    c++;
                                                }

                                            });

                                        });

                                        // angular.forEach(articles, function(value, key) {
                                            
                                        //     // Geocoding (GM API)
                                        //     googlemapsapi.geocode(articles[key].location)
                                                
                                        //         .then(function(data){
                                                    
                                        //             if(data.status === 'OK') {
                                        //                 articles[key].locationCoordonates = data.results[0].geometry.location;

                                        //                 // MapMarker
                                        //                 var marker = {  
                                        //                     id : articles[key]._id,
                                        //                     latitude: articles[key].locationCoordonates.lat,
                                        //                     longitude: articles[key].locationCoordonates.lng,
                                        //                     title: articles[key].headline.main,
                                        //                     icon: '../../images/marker.png'
                                        //                 };

                                        //                 $rootScope.markers.push(marker);
                                        //             }

                                        //         });

                                        // });

                                    } else {

                                        $rootScope.errorMessage = 'Sorry, the server respond with a error.';

                                    }

                                } else {

                                        $rootScope.errorMessage = 'Sorry, the server doesnt respond.';

                                }

                            });
                    page++;

                    }, 150, count);



            } else {
                $rootScope.errorMessage = 'Sorry, the server doesnt respond.';
            }
        }); 
        };

        search('');

        $scope.searchWithKeywords = function() {
            $rootScope.markers = [];
            $rootScope.articles = [];
            search($scope.keywords);
        };
});
