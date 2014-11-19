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
    'ngTouch',
    'uiGmapgoogle-maps',
    'angular-loading-bar',
    'hmTouchEvents',
    'monospaced.qrcode'
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
      .when('/mobile/:token', {
        templateUrl: 'views/mobile.html',
        controller: 'MobileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


// UI

var layout={};

layout.body=document.querySelector('body');

layout.setHeightFull = function() {
  var windowHeight = window.innerHeight;
  layout.body.style.height = windowHeight + 'px';
};

window.addEventListener('load',layout.setHeightFull,false);
