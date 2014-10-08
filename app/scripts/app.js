'use strict';

/**
 * @ngdoc overview
 * @name newYorkTimesApp
 * @description
 * # newYorkTimesApp
 *
 * Main module of the application.
 */
angular
  .module('newYorkTimesApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/trends', {
        templateUrl: 'views/trends.html',
        controller: 'TrendsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
