'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.NYTapi
 * @description
 * # NYTapi
 * Service in the newYorkTimesApp.
 */
angular
    .module('newYorkTimesApp')
    .service('NYTapi', function($rootScope, $scope, $q, $http){

	    this.getArticlesByKeyword = function(keyword) {
	        
	        var deferred = $q.defer();

	        $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq='+encodeURIComponent(keyword)+'&api-key=sample-key')
	            .success(function (data, status) {

	                deferred.resolve(data, status);

	            })

	            .error(function (data, status) {

	                deferred.resolve(data, status);

	            });

	        return deferred.promise;

	    };

  });
