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
    .controller('MobileCtrl', function ($scope, mobile, $routeParams) {
      
      $scope.localStorageArticles = [];
      refreshList();
 
      this.socket= io.connect('http://macbook-corentinf.local:2000');
      var token = $routeParams.token;       
      this.socket.emit('send mobile token',token);

      this.socket.on('added', function(currentArticle){
            mobile.AddToLocalStorage(currentArticle);
            refreshList();   
      });
    
    // Render the articles list
    function refreshList(){
        $scope.localStorageArticles = [];
        for(var i=0; i <window.localStorage.length; i++)
        {     
            if(window.localStorage.key(i) != "debug")
            {
                $scope.localStorageArticles = mobile.getArticleInLocalStorage(i,$scope.localStorageArticles);  
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }      
        }   
    }
      
});
