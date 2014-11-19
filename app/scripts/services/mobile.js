'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.mobile
 * @description
 * # mobile
 * Service in the newYorkTimesApp.
 */
angular.module('newYorkTimesApp')
    .service('mobile', function mobile($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    //Add the article to the device local storage
    this.AddToLocalStorage = function(article){
        if(window.localStorage.getItem(article._id)){
            $rootScope.errorMessage = "Article already save";
        }else{
            window.localStorage.setItem(String(article._id),JSON.stringify(article));
        }
    }
    
    //get the list of articles 
    this.getArticleInLocalStorage = function(i, listArticle){
        listArticle.push(JSON.parse(window.localStorage.getItem(window.localStorage.key(i))));
        return listArticle;
    }
    
    //delete the article in the local storage
    this.deleteArticleInStorage = function(id){
        window.localStorage.removeItem(id);
    }
    
  });
