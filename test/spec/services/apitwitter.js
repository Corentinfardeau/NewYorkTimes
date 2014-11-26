'use strict';

describe('Service: apiTwitter', function () {

  // load the service's module
  beforeEach(module('newYorkTimesApp'));

  // instantiate service
  var apiTwitter;
  beforeEach(inject(function (_apiTwitter_) {
    apiTwitter = _apiTwitter_;
  }));

  it('should do something', function () {
    expect(!!apiTwitter).toBe(true);
  });

});
