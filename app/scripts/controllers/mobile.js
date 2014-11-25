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
    .controller('MobileCtrl', function ($rootScope, $scope, Config, mobile) {
        
		$scope.localStorageArticles  = [];
	
		// Render the articles list
		function refreshList(){
			$scope.localStorageArticles = [];
			for(var i = 0; i < window.localStorage.length; i++)
			{     
				
				if(window.localStorage.key(i) !== 'debug' && window.localStorage.key(i) !== 'token'){
					
					$scope.localStorageArticles = mobile.getArticleInLocalStorage(i, $scope.localStorageArticles);  

					//$scope.$apply();
					
				}	     
			}   
		}
	
      this.socket = io.connect(Config.NODE_SERVER);
    
      $scope.socket = this.socket;
  
      if(!window.localStorage.getItem('token'))
      {
		  
		  do
		  {
			$scope.saisie = prompt('Met ton code', 'code');
		  } 
		  while ($scope.saisie === null);

		  //Join the room
		  this.socket.emit('join room', $scope.saisie);

		  //callback if room is joined
		  this.socket.on('success joined',function(){
			  //stock the token in LS
			  window.localStorage.setItem('token', $scope.saisie);
			  //ask for article
			  $scope.socket.emit('get firstArticle', $scope.saisie); 
		  });

		  //callback if room is not joined
		  this.socket.on('error joined', function(){
			 console.log('error'); 
		  });

		  //get the last article from desk
		  this.socket.on('add firstArticle',function(article){
			  mobile.AddToLocalStorage(article);
			  refreshList();
		  });
        }
		else
		{	
			//If user is already connected we refresh his list
			refreshList();
			
			//Join the room
			this.socket.emit('join room', window.localStorage.getItem('token'));
			
			this.socket.on('success joined',function(){
				//ask for article
				$scope.socket.emit('get firstArticle', $scope.saisie); 
			});
			
			//get the last article from desk
			this.socket.on('add firstArticle',function(article){
				mobile.AddToLocalStorage(article);
				refreshList();
			});
			
		}
		
		this.socket.on('add article', function(article){
			mobile.AddToLocalStorage(article);
			refreshList();
		});
      
});
