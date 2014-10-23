'use strict';

describe('Service: googlemapsapi', function () {

  // load the service's module
  beforeEach(module('newYorkTimesApp'));

  // instantiate service
  var googlemapsapi;
  beforeEach(inject(function (_googlemapsapi_) {
    googlemapsapi = _googlemapsapi_;
  }));

  it('should do something', function () {
    expect(!!googlemapsapi).toBe(true);
  });

});
