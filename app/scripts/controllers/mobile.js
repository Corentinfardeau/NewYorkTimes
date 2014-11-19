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
    .controller('MobileCtrl', function ($rootScope, $scope) {
      
      var articles = new Array();
      this.socket= io.connect('http://macbook-corentinf.local:2000');
      this.socket.on('added', function(currentArticle){
            alert('Nouvel Article');
            articles.push(currentArticle);
            console.log(articles);
      });
});
