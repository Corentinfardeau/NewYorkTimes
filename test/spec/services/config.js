'use strict';

describe('Service: Config', function () {

  // load the service's module
  beforeEach(module('newYorkTimesApp'));

  // instantiate service
  var Config;
  beforeEach(inject(function (_config_) {
    config = _config_;
  }));

  it('should do something', function () {
    expect(!!config).toBe(true);
  });

});
