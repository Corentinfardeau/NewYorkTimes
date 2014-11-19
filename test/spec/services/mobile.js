'use strict';

describe('Service: mobile', function () {

  // load the service's module
  beforeEach(module('newYorkTimesApp'));

  // instantiate service
  var mobile;
  beforeEach(inject(function (_mobile_) {
    mobile = _mobile_;
  }));

  it('should do something', function () {
    expect(!!mobile).toBe(true);
  });

});
