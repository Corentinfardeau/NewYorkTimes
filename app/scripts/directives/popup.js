'use strict';

/**
 * @ngdoc directive
 * @name newYorkTimesApp.directive:popup
 * @description
 * # popup
 */
angular.module('newYorkTimesApp')
  .directive('popup', function () {
    return {
      templateUrl: 'views/partials/_asideArticle.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });
