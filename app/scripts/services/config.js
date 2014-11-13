'use strict';

/**
 * @ngdoc service
 * @name newYorkTimesApp.config
 * @description
 * # config
 * Factory in the newYorkTimesApp.
 */
angular
    .module('newYorkTimesApp')
    .factory('Config', function () {
        return {
            API_URL : 'http://api.nytimes.com',
            API_KEY : '025d399fa9499ddf65f25c59f0da567a:17:69905533',
            REQUESTS_LIMIT : 15,
            DEBUG : true
        };
    });
