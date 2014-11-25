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
	this.getArticles = function (keyword, page) {
	        
        var deferred = $q.defer();
        var keyword = keyword ? ('fq='+keyword+'&') : '';
        var p = page ? ('&page='+page) : '';

        $http
            .get(Config.API_URL+'/svc/search/v2/articlesearch.json?'+keyword+'api-key='+Config.API_KEY+p)
            .success( function (data) {
			
                angular.forEach(data.response.docs, function (value) {

                    if($rootScope.sections.indexOf(value.section_name) === -1 && value.section_name !== null) {
                        $rootScope.sections.push(value.section_name);
						$rootScope.sectionsChecked.push(value.section_name);
                    }

                    angular.forEach( value.keywords, function (v) {
                        var count = 0;
                        if( v.name === 'glocations' ) {
                            
                            if ( count === 0 ) {
                                value.location = v.value;
                                value.headline.main = decodeURI(value.headline.main);
                                value.snippet = decodeURI(value.snippet);
                                value.pub_date = value.pub_date.split('T')[0];
                                $rootScope.articles[value._id] = value;
                                googlemapsapi.geocode(value.location, value.section_name, value._id)
                                .then(function(location){
                                    value.coordinates = location;
                                });
                            }
                            else {
                                var clone = value.slice();
                                clone.location = v.value;
                                clone.pub_date = clone.pub_date.split('T')[0];
                                googlemapsapi.geocode(clone.location, value.section_name, clone._id)
                                .then(function(location){
                                    clone.coordinates = location;
                                });
                            }
                            
                            count++;
                        }

                    });

                });
                
                deferred.resolve();

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
            .get(Config.API_URL+'/svc/search/v2/articlesearch.json?'+key+'api-key='+Config.API_KEY)
            .success(function (data) {
                deferred.resolve(data.response.meta.hits);
            })
            .error(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        };

    /**
     * @ngdoc function
     * @name core.Services.Castrapi#getArticlesMostShared
     * @methodOf core.Services.apinyt
     * @return {object} Returns a promise object
     */
    this.getArticlesMostShared = function(section, timePeriod) {
        
        var deferred = $q.defer();

        $http
        .get(Config.API_URL+'/svc/mostpopular/v2/mostshared/'+section+'/'+timePeriod+'.json?api-key='+Config.API_KEY)
            .success(function (data) {
                var mostShared = [];
                angular
                    .forEach(data.results, function (value) {
                        mostShared.push(value);
                    });
                deferred.resolve(mostShared);
            })
            .error(function (data) {
                deferred.resolve(data);
            });
        
        return deferred.promise;
    };
    
    /**
     * @ngdoc function
     * @name core.Services.Castrapi#getArticlesMostViewed
     * @methodOf core.Services.apinyt
     * @return {object} Returns a promise object
     */
    this.getPopularArticles = function(section, timePeriod, action) {
        
        var deferred = $q.defer();

        $http
            .get(Config.API_URL+'/svc/mostpopular/v2/'+action+'/'+section+'/'+timePeriod+'.json?api-key='+Config.API_KEY)
            .success(function (data) {
                
                var mostViewed = [];
                
                angular
                    .forEach(data.results, function (value) {
                        mostViewed.push(value);
                    });
            
                deferred.resolve(mostViewed);
            })
            .error(function (data) {
                deferred.resolve(data);
            });

        return deferred.promise;
    };

});