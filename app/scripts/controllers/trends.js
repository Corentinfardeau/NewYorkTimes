'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:TrendsCtrl
 * @description
 * # TrendsCtrl
 * Controller of the newYorkTimesApp
 */
angular.module('newYorkTimesApp')
  .controller('TrendsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
