'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.mobile
 * @description
 * # mobile
 * Service in the newYorkTimesApp.
 */
angular
	.module('newYorkTimesApp')
    .service('mobile', function mobile ($rootScope) {

		// Add the article to the device localStorage
		this.AddToLocalStorage = function (article) {
			if(window.localStorage.getItem(article._id)){
				$rootScope.errorMessage = 'Article already saved';
			} else {
				window.localStorage.setItem(String(article._id),JSON.stringify(article));
			}
		};

		// Get the list of articles stocked in the localstorage
	this.getArticleInLocalStorage = function (i, listArticle) {
			listArticle.push(JSON.parse(window.localStorage.getItem(window.localStorage.key(i))));
			return listArticle;
		};

		// Delete the article in the local storage
		this.deleteArticleInStorage = function (id) {
			window.localStorage.removeItem(id);
		};
        
        // generate random token
        this.generateToken = function () {
          var token = '';
          var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

          for( var i=0; i < 5; i++ ){
            token += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return token;
        };
    
	});
