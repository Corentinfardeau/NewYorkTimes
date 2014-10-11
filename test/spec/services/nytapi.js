'use strict';

describe('Service: NYTapi', function () {

  // load the service's module
  beforeEach(module('newYorkTimesApp'));

  // instantiate service
  var NYTapi;
  beforeEach(inject(function (_NYTapi_) {
    NYTapi = _NYTapi_;
  }));

  it('should do something', function () {
    expect(!!NYTapi).toBe(true);
  });

});
