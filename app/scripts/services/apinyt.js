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
    .service('apinyt', function apinyt($rootScope, $http, $q) {
	 
	 /**
     * @ngdoc function
     * @name core.Services.Castrapi#getArticles
     * @methodOf core.Services.apinyt
     * @return {object} Returns a promise object
     */
	this.getArticles = function(keyword, page) {
	        
        var deferred = $q.defer();

        var key = keyword ? ('fq='+keyword+'&') : '';
        var p = page ? ('&page='+page) : '';
        var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?'+key+'api-key=sample-key'+p;

        $http.get(url)
            .success(function (data, status) {

                deferred.resolve(data, status);

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
        var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?'+key+'api-key=sample-key';

        $http.get(url)
            .success(function (data, status) {

                deferred.resolve(data, status);

            })
            .error(function (data, status) {

                deferred.resolve(data, status);

            });

	 	return deferred.promise;
	 };

  });
