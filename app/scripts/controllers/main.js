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

        var keyword = 'ebola';

        // Search submit by hit enter key
        $scope.submit = function() { 

            keyword = $scope.keywords;
            $scope.articles = [];
            $rootScope.markers = [];

            search(keyword);
        };

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
                styles:[{'featureType':'water','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':17}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':20}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'},{'lightness':17}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#000000'},{'lightness':29},{'weight':0.2}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':18}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':16}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':21}]},{'elementType':'labels.text.stroke','stylers':[{'visibility':'on'},{'color':'#000000'},{'lightness':16}]},{'elementType':'labels.text.fill','stylers':[{'saturation':36},{'color':'#000000'},{'lightness':40}]},{'elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':19}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'},{'lightness':20}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#000000'},{'lightness':17},{'weight':1.2}]}],
                panControl:false,
                scaleControl:false,
                zoomControl:false,
                streetViewControl:false
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
        var requestsLimit = 30;

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


        search(keyword);

});
