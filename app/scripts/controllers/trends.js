'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:TrendsCtrl
 * @description
 * # TrendsCtrl
 * Controller of the newYorkTimesApp
 */
angular
	.module('newYorkTimesApp')
	.controller('TrendsCtrl', function ($scope, apinyt) {
        
        apinyt
            .getPopularArticles('sports','30', 'mostviewed')
            .then(function (articles) {
                $scope.articles = articles;
            });
	});
