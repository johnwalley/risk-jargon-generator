'use strict';

/* Controllers */

angular.module('riskJargonGenerator.controllers', ['riskJargonGenerator.services']).
controller('JargonCtrl', ['$scope', 'Jargon', 'JargonService', '$q', function($scope, Jargon, JargonService, $q) {
	$scope.isCollapsed = true;

	$scope.refresh = function() {
		$scope.sentence = Jargon.generate(jargon);
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
  $q.all([verbs.load(), abbreviations.load(), nouns.load(), adjectives.load()]).then( function() { $scope.sentence = Jargon.generate(jargon)} );

  $scope.verbs = verbs;
  $scope.abbreviations = abbreviations;
  $scope.nouns = nouns;
  $scope.adjectives = adjectives;

  $scope.addVerb = function() {
  	verbs.addWord($scope.newverb)
  };

  $scope.addAbbreviation = function() {
  	abbreviations.addWord($scope.newabbreviation)
  };

  $scope.addNoun = function() {
  	nouns.addWord($scope.newnoun)
  };

  $scope.addAdjective = function() {
  	adjectives.addWord($scope.newadjective)
  };
}]);
