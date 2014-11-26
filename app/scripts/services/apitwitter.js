'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.apiTwitter
 * @description
 * # apiTwitter
 * Service in the newYorkTimesApp.
 */
angular
	.module('newYorkTimesApp')
	.service('apiTwitter', function apiTwitter($http, $q) {

	/**
	* @ngdoc function
	* @name core.Services.Castrapi#getRelatedTweets
	* @methodOf core.Services.apiTwitter
	* @return {object} Returns a promise object
	*/
	this.getRelatedTweets = function(hashtag) {

		var deferred = $q.defer();

		$http
			.get('http://www.pierrelevaillant.me/NYTAPI/?hashtag='+hashtag)
			.success(function (data) {
			        var relatedTweets = data.statuses;
					deferred.resolve(relatedTweets);
			})
			.error(function (data, status) {
				deferred.resolve(data, status);
			});

		return deferred.promise;
	};
	
});
