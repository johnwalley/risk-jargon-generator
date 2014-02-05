'use strict';

/* Controllers */

angular.module('riskJargonGenerator.controllers', ['riskJargonGenerator.services']).
controller('JargonCtrl', ['$scope', 'Jargon', 'JargonService', 'History', '$q', function($scope, Jargon, JargonService, History, $q) {
	
  $scope.isCollapsed = true;

	$scope.refresh = function() {
    var sentence = Jargon.generate(jargon);
    History.history.Update(sentence);
    $scope.history = History.history;
	}

  // Get the collections from our data definitions
  var verbs = new JargonService.verbs();
  var abbreviations = new JargonService.abbreviations();
  var nouns = new JargonService.nouns();
  var adjectives = new JargonService.adjectives();

  var jargon =  {
  	verbs: verbs,
  	abbreviations: abbreviations,
  	nouns: nouns,
  	adjectives: adjectives,
  };

  // Wait for all promises to resolve before creating initial jargon.
  $q.all([verbs.load(), abbreviations.load(), nouns.load(), adjectives.load()]).then( function() { $scope.refresh() });

  $scope.verbs = verbs;
  $scope.abbreviations = abbreviations;
  $scope.nouns = nouns;
  $scope.adjectives = adjectives;

  $scope.addVerb = function() {
  	verbs.addWord($scope.newverb);
    $scope.newverb = "";
  };

  $scope.removeVerb = function(verb) {
    verbs.removeWord(verb);
  }

  $scope.addAbbreviation = function() {
  	abbreviations.addWord($scope.newabbreviation);
    $scope.newabbreviation = "";
  };

  $scope.removeAbbreviation = function(abbreviation) {
    abbreviations.removeWord(abbreviation);
  }  

  $scope.addNoun = function() {
  	nouns.addWord($scope.newnoun)
    $scope.newnoun = "";
  };

  $scope.removeNoun = function(noun) {
    nouns.removeWord(noun);
  }    

  $scope.addAdjective = function() {
  	adjectives.addWord($scope.newadjective);
    $scope.newadjective = "";
  };

  $scope.removeAdjective = function(adjective) {
    adjectives.removeWord(adjective);
  }     
}]).
controller('DropdownCtrl', ['$scope', 'History', function($scope, History) {
  $scope.items = History.history;
  $scope.Jump = History.history.Jump;
}]);
