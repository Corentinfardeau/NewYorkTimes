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
			APP_URL : 'http://plevaillant.local:3000',
			API_URL : 'http://api.nytimes.com',
			//API_KEY : '10170fe04dc8e39f949526bf76e0820b:9:52396025',
			API_KEY : 'sample-key',
			NODE_SERVER : 'http://37.187.5.222:2000/',
            REQUESTS_LIMIT : 15,
            GMAP_STYLE:[{'featureType':'water','elementType':'all','stylers':[{'hue':'#e9ebed'},{'saturation':-78},{'lightness':67},{'visibility':'simplified'}]},{'featureType':'landscape','elementType':'all','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'geometry','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':31},{'visibility':'simplified'}]},{'featureType':'poi','elementType':'all','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'hue':'#e9ebed'},{'saturation':-90},{'lightness':-8},{'visibility':'simplified'}]},{'featureType':'transit','elementType':'all','stylers':[{'hue':'#e9ebed'},{'saturation':10},{'lightness':69},{'visibility':'on'}]},{'featureType':'administrative.locality','elementType':'all','stylers':[{'hue':'#2c2e33'},{'saturation':7},{'lightness':19},{'visibility':'on'}]},{'featureType':'road','elementType':'labels','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':31},{'visibility':'on'}]},{'featureType':'road.arterial','elementType':'labels','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':-2},{'visibility':'simplified'}]}],
            DEBUG : true
        };
    });
