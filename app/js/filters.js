'use strict';

/* Filters */

angular.module('riskJargonGenerator.filters', ['riskJargonGenerator.services']).
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
filter('lastTen', ['History', function(History) {
  return function(items) {
  	var len = items.length;

  	if (len <= 1)
  		return ["No history to show"];

  	var numItemsInHistory = 10;

    if (History.history.stale) {
      return items.slice(Math.max(0, len - numItemsInHistory - 1), len).reverse();
    } else {
      return items.slice(Math.max(0, len - numItemsInHistory - 1), -1).reverse();
    }
  }
}]);