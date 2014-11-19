'use strict';

/**
 * @ngdoc function
 * @name newYorkTimesApp.controller:MobileCtrl
 * @description
 * # MobileCtrl
 * Controller of the newYorkTimesApp
 */
angular
    .module('newYorkTimesApp')
    .controller('MobileCtrl', function ($scope) {
      
      $scope.articles = [];
      
      this.socket= io.connect('http://macbook-corentinf.local:2000');
      this.socket.on('added', function(currentArticle){
            $scope.articles.push(currentArticle);
            $scope.$apply();
            //console.log(articles);
      });
});
