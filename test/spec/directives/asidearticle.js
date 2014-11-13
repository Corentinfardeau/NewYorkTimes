'use strict';

describe('Directive: asideArticle', function () {

  // load the directive's module
  beforeEach(module('newYorkTimesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<aside-article></aside-article>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the asideArticle directive');
  }));
});
