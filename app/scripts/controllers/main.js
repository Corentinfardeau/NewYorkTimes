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
    .controller('MainCtrl', function ($rootScope, $scope, $http, $timeout, googlemapsapi, apinyt) {

        // Error message
        $rootScope.errorMessage = '';

        var articles = [];
        $rootScope.markers = [];

        // Set the map
        $rootScope.map = {
            control: {},
            center: {
            latitude: 34.833703,
            longitude: -41.768816
            },
            zoom: 3,
            options: {
                styles:[{'featureType':'landscape','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'stylers':[{'hue':'#00aaff'},{'saturation':-100},{'gamma':2.15},{'lightness':12}]},{'featureType':'road','elementType':'labels.text.fill','stylers':[{'visibility':'on'},{'lightness':24}]},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':57}]}],
                panControl:false,
                scaleControl:false,
                zoomControl:false,
                streetViewControl:false
            },
            bounds: {}
        };

        // Set fullscreen for map
        document.getElementsByClassName('angular-google-map-container')[0].style.height = window.innerHeight+'px';
        
        // API search (argument: keyword, requestsLimit)
        var search = '';
        var requestsLimit = 15;

        apinyt
        .getNbArticles(search)
        .then(function(data, status) {
            if (data !== null) {
                var pages = data.response.meta.hits/10;
                var count = pages<requestsLimit ? pages : requestsLimit; 

                for(var page=1; page<count+1; page++) {
                    // Start get articles
                    apinyt
                        .getArticles(search, page)
                        .then(function (data, status) {

                            if (data !== null) {

                                if (data.response !== undefined) {
                                    
                                    angular.forEach(data.response.docs, function(value, key){

                                        angular.forEach(value.keywords, function(v,k){
                                            var c = 0;
                                            if( v.name==='glocations' ) {
                                                if(c === 0) {
                                                    value.location = v.value;
                                                    articles.push(value);
                                                }
                                                else {
                                                    var clone = value.slice();
                                                    clone.location = v.value;
                                                    articles.push(clone);
                                                }
                                                c++;
                                            }
                                        });
                                    });

                                    angular.forEach(articles, function(value, key) {
                                        
                                        // Geocoding (GM API)
                                        googlemapsapi.geocode(articles[key].location)
                                            
                                            .then(function(data){
                                                
                                                if(data.status === 'OK') {
                                                    articles[key].locationCoordonates = data.results[0].geometry.location;

                                                    // MapMarker
                                                    var marker = {  
                                                        id : articles[key]._id,
                                                        latitude: articles[key].locationCoordonates.lat,
                                                        longitude: articles[key].locationCoordonates.lng,
                                                        title: articles[key].headline.main,
                                                        icon: '../../images/marker.png'
                                                    };

                                                    $rootScope.markers.push(marker);
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
                    }  

            } else {
                $rootScope.errorMessage = 'Sorry, the server doesnt respond.';
            }
        });

    

});
