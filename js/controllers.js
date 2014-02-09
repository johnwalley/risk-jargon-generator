'use strict';

/* Controllers */

angular.module('riskJargonGenerator.controllers', ['riskJargonGenerator.services']).
controller('JargonCtrl', ['$scope', 'Jargon', 'JargonService', 'History', '$q', 'load', function($scope, Jargon, JargonService, History, $q, load) {
	
  $scope.isCollapsed = true;

  var jargon = load;  

	$scope.refresh = function() {
    var sentence = Jargon.generate(jargon);
    History.history.Update(sentence);
    $scope.history = History.history;
	}

  $scope.refresh();

  $scope.verbs = jargon.verbs;
  $scope.abbreviations = jargon.abbreviations;
  $scope.nouns = jargon.nouns;
  $scope.adjectives = jargon.adjectives;

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
