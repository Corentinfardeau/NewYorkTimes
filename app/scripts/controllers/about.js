'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the newYorkTimesApp
 */
angular.module('newYorkTimesApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
