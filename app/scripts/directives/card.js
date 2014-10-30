'use strict';

/**
 * @ngdoc directive
 * @name newYorkTimesApp.directive:card
 * @description
 * # card
 */
angular.module('newYorkTimesApp')
  .directive('card', function () {
    return {
      templateUrl: 'views/partials/_card.html',
      restrict: 'E',
      link: function postLink(scope) {

  			var width = document.getElementsByClassName('card-container')[0].offsetWidth+20;
   			var limit = width/2;

       		scope.onHammer = function onHammer (event) {

       			if(event.deltaX<=0)
       			{
	       			var card = event.target.parentNode;

	       			while(!hasClass(card, 'card'))
		      			{
							card = card.parentNode;
		      			}

	      			var removeCard = card.nextSibling.nextSibling;
	      			var svg = removeCard.querySelector('svg');

	      			card.className = 'card';
	      			removeCard.className = 'remove-card';

	      			card.style.webkitTransform = 'translateX('+event.deltaX+'px)';
	      			card.style.MozTransform = 'translateX('+event.deltaX+'px)';	
	      			card.style.msTransform = 'translateX('+event.deltaX+'px)';	
	      			card.style.transform = 'translateX('+event.deltaX+'px)';

	      			removeCard.style.webkitTransform = 'translateX('+event.deltaX+'px)';
	      			removeCard.style.MozTransform = 'translateX('+event.deltaX+'px)';	
	      			removeCard.style.msTransform = 'translateX('+event.deltaX+'px)';	
	      			removeCard.style.transform = 'translateX('+event.deltaX+'px)';

	      			var opacity = -(event.deltaX/limit);
	      			var opacity2 = (1-(-(event.deltaX/width)));

	      			svg.style.opacity = opacity;
	      			card.style.opacity = opacity2;
	      			
       			}

			};

			scope.onHammerEnd = function onHammerEnd (event) {

				var card = event.target.parentNode;

				while(!hasClass(card, 'card'))
				{
					card = card.parentNode;
				}

				var removeCard = card.nextSibling.nextSibling;

				card.className = 'card smoothEffect';
				removeCard.className = 'remove-card smoothEffect';

       			if(event.deltaX < -limit)
       			{


	      			card.style.webkitTransform = 'translateX(-'+width*2+'px)';
	      			card.style.MozTransform = 'translateX(-'+width*2+'px)';	
	      			card.style.msTransform = 'translateX(-'+width*2+'px)';	
	      			card.style.transform = 'translateX(-'+width*2+'px)';

	      			removeCard.style.webkitTransform = 'translateX(-'+width*2+'px)';
	      			removeCard.style.MozTransform = 'translateX(-'+width*2+'px)';	
	      			removeCard.style.msTransform = 'translateX(-'+width*2+'px)';	
	      			removeCard.style.transform = 'translateX(-'+width*2+'px)';
	      			
      				var mobileContainer = document.getElementById('mobile-container');
	       			var cardDirective = card.parentNode.parentNode;


	      			setTimeout(function(){
		       			
		       			mobileContainer.removeChild(cardDirective);

	      			},300);

       			}
       			else
       			{

	      			card.style.webkitTransform = 'translateX(0px)';
	      			card.style.MozTransform = 'translateX(0px)';	
	      			card.style.msTransform = 'translateX(0px)';	
	      			card.style.transform = 'translateX(0px)';

	      			removeCard.style.webkitTransform = 'translateX(0px)';
	      			removeCard.style.MozTransform = 'translateX(0px)';	
	      			removeCard.style.msTransform = 'translateX(0px)';	
	      			removeCard.style.transform = 'translateX(0px)';

       			}
			};

			function hasClass(elem, className) {
			    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
			}

      }
    };
  });
