'use strict';

/**
 * @ngdoc directive
 * @name newYorkTimesApp.directive:asideArticle
 * @description
 * # asideArticle
 */
angular.module('newYorkTimesApp')
  .directive('asideArticle', function () {
    return {
      templateUrl: 'views/partials/_asideArticle.html',
      restrict: 'E',
      link: function() {
            document.querySelector('aside-article').classList.add('hidden');
            var btnClose = document.querySelector('aside-article .btn-close');
            btnClose.addEventListener('click', function(e){
                e.preventDefault();
                document.querySelector('aside-article').classList.add('hidden');
            }, false);

      }
    };
  });
