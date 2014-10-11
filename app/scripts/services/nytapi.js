'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.NYTapi
 * @description
 * # NYTapi
 * Service in the newYorkTimesApp.
 */
angular
    .module('newYorkTimesApp')
    .service('NYTapi', ['appConfig', '$http', function NYTapi($appConfig, $http) {

        this.searchArticlesByTerms = function(terms){

            $http.get($appConfig.API_URL + '/svc/search/v2/articlesearch.json?fq=' + terms + '&api-key=' + $appConfig.API_KEY,
            {
                timeout: $appConfig.HTTP_REQUEST_DEFAULT_TIMEOUT
            })
            .success(function (data, status) {
                    return data.response;
            })
            .error(function (data, status) {
                    return false;
            });

        };
  }]);
