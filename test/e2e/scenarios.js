'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../app/index.html');
  });


  it('should automatically redirect to /jargon when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/jargon");
  });
});
