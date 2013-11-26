'use strict';

/* Directives */

<<<<<<< HEAD
angular.module('riskJargonGenerator.directives', ['riskJargonGenerator.services']).
=======
angular.module('riskJargonGenerator.directives', []).
>>>>>>> master
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
