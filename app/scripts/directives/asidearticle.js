'use strict';

/**
 * @ngdoc directive
 * @name newYorkTimesApp.directive:asideArticle
 * @description
 * # asideArticle
 */
angular.module('newYorkTimesApp')
  .directive('asideArticle', function ($rootScope) {
    return {
      templateUrl: 'views/partials/_asideArticle.html',
      restrict: 'E',
      link: function() {
            document.querySelector('aside-article').classList.toggle('hidden');
            document.querySelector('aside-article .btn-close').addEventListener('click', function(e){
                e.preventDefault();
                //Sound when opening
                var audio = new Audio('../sons/closed.mp3');
                audio.volume=.1;
                audio.play();
                document.querySelector('aside-article').classList.toggle('hidden');
                $rootScope.activeMarker.options.animation = 0;
                $rootScope.map.center = {latitude: 34.833703,longitude: -41.768816};
                $rootScope.map.zoom = 3;
				
                $rootScope.$apply();
                
            }, false);
      }
    };
  });
