'use strict';

/**
 * @ngdoc directive
 * @name newYorkTimesApp.directive:card
 * @description
 * # card
 */
angular
    .module('newYorkTimesApp')
.directive('card', function (mobile) {
		return {
		  templateUrl: 'views/partials/_card.html',
		  restrict: 'E',
		  link: function postLink(scope) {


				var width = document.getElementsByClassName('card-container')[0].offsetWidth+20;
				var limit = width/2;

				// On dragmove event
				scope.onHammer = function onHammer (event) {

					// If gesture is left
					if(event.deltaX<=0)
					{
						// Get the target of the event
						var card = event.target.parentNode;

						// As the class is not card, we go back into the DOM
						while(!hasClass(card, 'card'))
							{
								//We stock the container of the div card
								card = card.parentNode;
							}

						// Get the remove div
						var removeCard = card.nextSibling.nextSibling;

						// Add the classes
						card.classList.add('card');
						removeCard.classList.add('remove-card');

						// Remove classes
						card.classList.remove('smoothEffect');
						removeCard.classList.remove('smoothEffect');

						// Apply the style
						card.style.webkitTransform = 'translateX('+event.deltaX+'px)';
						card.style.MozTransform = 'translateX('+event.deltaX+'px)';	
						card.style.msTransform = 'translateX('+event.deltaX+'px)';	
						card.style.transform = 'translateX('+event.deltaX+'px)';

						removeCard.style.webkitTransform = 'translateX('+event.deltaX+'px)';
						removeCard.style.MozTransform = 'translateX('+event.deltaX+'px)';	
						removeCard.style.msTransform = 'translateX('+event.deltaX+'px)';	
						removeCard.style.transform = 'translateX('+event.deltaX+'px)';

						// Calcul of the trash opacity
						var svgOpacity = -(event.deltaX/limit);

						// Calcul of the card opacity
						var cardOpacity = (1-(-(event.deltaX/width)));


						var svg = removeCard.querySelector('svg');

						// Apply style
						svg.style.opacity = svgOpacity;
						card.style.opacity = cardOpacity;

					}

				};
				// On dragend event
				scope.onHammerEnd = function onHammerEnd (event) {

					// Get the target of the event
					var card = event.target.parentNode;

					// As the class is not card, we go back into the DOM
					while(!hasClass(card, 'card'))
					{
						// We stock the container of the div card
						card = card.parentNode;
					}

					// Get the remove div
					var removeCard = card.nextSibling.nextSibling;

					// Add classes
					card.classList.add('smoothEffect');
					removeCard.classList.add('smoothEffect');

					// If the gesture is more than the middle of any screen
					if(event.deltaX < -limit)
					{
						// Apply style to remove the card
						card.style.webkitTransform = 'translateX(-'+width*2+'px)';
						card.style.MozTransform = 'translateX(-'+width*2+'px)';	
						card.style.msTransform = 'translateX(-'+width*2+'px)';	
						card.style.transform = 'translateX(-'+width*2+'px)';

						removeCard.style.webkitTransform = 'translateX(-'+width*2+'px)';
						removeCard.style.MozTransform = 'translateX(-'+width*2+'px)';	
						removeCard.style.msTransform = 'translateX(-'+width*2+'px)';	
						removeCard.style.transform = 'translateX(-'+width*2+'px)';


						var mobileContainer = document.getElementById('mobile-container');

						// Get the directive in the HTML
						var cardDirective = card.parentNode.parentNode;

						// Remove all the card after the transition (0,3s)
						setTimeout(function(){
							mobileContainer.removeChild(cardDirective);
							var id = card.getAttribute('data-id');
							mobile.deleteArticleInStorage(id);
						},300);

						setTimeout(function(){

							card.style.height = '0px';

						},200);

					}
					// If the gesture is less than the middle of any screen
					else
					{	
						// Apply style to not remove the card
						card.style.webkitTransform = 'translateX(0px)';
						card.style.MozTransform = 'translateX(0px)';	
						card.style.msTransform = 'translateX(0px)';	
						card.style.transform = 'translateX(0px)';

						removeCard.style.webkitTransform = 'translateX(0px)';
						removeCard.style.MozTransform = 'translateX(0px)';	
						removeCard.style.msTransform = 'translateX(0px)';	
						removeCard.style.transform = 'translateX(0px)';

						var svg = removeCard.querySelector('svg');

						//Opacity to 1
						svg.style.opacity = '1';
						card.style.opacity = '1';

					}
				};

				// Fonction permettant de savoir si la classe existe
				function hasClass(elem, className) {
					return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
				}

		  }
		};
  });
