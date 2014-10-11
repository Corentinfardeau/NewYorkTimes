'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.appConfig
 * @description
 * # appConfig
 * Service in the newYorkTimesApp.
 */
angular
    .module('newYorkTimesApp')
    .factory('appConfig', function appConfig() {
            return {
                API_URL: 'http://api.nytimes.com',
                API_KEY: '025d399fa9499ddf65f25c59f0da567a:17:69905533',
                HTTP_REQUEST_DEFAULT_TIMEOUT: 60000
            };
  });
