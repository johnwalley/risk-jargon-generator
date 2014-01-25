'use strict';

/* Filters */

angular.module('riskJargonGenerator.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  }
}).
  filter('lastTen', function() {
  return function(items) {
  	var len = items.length;

  	if (len <= 1)
  		return ["No history to show"];

    return items.slice(Math.max(0, length - 6), -1).reverse();
  }
});