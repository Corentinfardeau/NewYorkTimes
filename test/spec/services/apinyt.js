'use strict';

describe('Service: apinyt', function () {

  // load the service's module
  beforeEach(module('newYorkTimesApp'));

  // instantiate service
  var apinyt;
  beforeEach(inject(function (_apinyt_) {
    apinyt = _apinyt_;
  }));

  it('should do something', function () {
    expect(!!apinyt).toBe(true);
  });

});
