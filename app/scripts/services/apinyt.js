'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.apinyt
 * @description
 * # apinyt
 * Service in the newYorkTimesApp.
 */
angular
    .module('newYorkTimesApp')
    .service('apinyt', function apinyt($rootScope, $http, $q, googlemapsapi, Config) {
	 
	 /**
     * @ngdoc function
     * @name core.Services.Castrapi#getArticles
     * @methodOf core.Services.apinyt
     * @return {object} Returns a promise object
     */
	this.getArticles = function(keyword, page) {
	        
        var deferred = $q.defer();
        var keyword = keyword ? ('fq='+keyword+'&') : '';
        var p = page ? ('&page='+page) : '';

        $http
            .get(Config.API_URL+'/svc/search/v2/articlesearch.json?'+keyword+'api-key=sample-key'+p)
            .success(function (data) {
            
                angular.forEach(data.response.docs, function (value) {

                    if($rootScope.sections.indexOf(value.section_name) === -1) {
                        $rootScope.sections.push(value.section_name);
                    }

                    angular.forEach(value.keywords, function(v){
                        var count = 0;
                        if( v.name==='glocations' ) {
                            
                            if(count === 0) {
                                value.location = v.value;
                                value.headline.main = decodeURI(value.headline.main);
                                value.snippet = decodeURI(value.snippet);
                                value.pub_date = value.pub_date.split('T')[0];
                                $rootScope.articles[value._id] = value;
                                googlemapsapi.geocode(value.location, value.section_name, value._id);
                            }
                            else {
                                var clone = value.slice();
                                clone.location = v.value;
                                clone.pub_date = clone.pub_date.split('T')[0];
                                googlemapsapi.geocode(clone.location, value.section_name, clone._id);
                            }
                            
                            count++;
                        }

                    });

                });
                
                deferred.resolve($rootScope.articles);

            })
            .error(function (data, status) {
                deferred.resolve(data, status);
            });

        return deferred.promise;

	 };

     /**
     * @ngdoc function
     * @name core.Services.Castrapi#getNbArticles
     * @methodOf core.Services.apinyt
     * @return {object} Returns a promise object
     */
    this.getNbArticles = function(keyword) {

        var deferred = $q.defer();
        var key = keyword ? ('fq='+keyword+'&') : '';

        $http
            .get(Config.API_URL+'/svc/search/v2/articlesearch.json?'+key+'api-key=sample-key')
            .success(function (data) {
                deferred.resolve(data.response.meta.hits);
            })
            .error(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        };

    });
