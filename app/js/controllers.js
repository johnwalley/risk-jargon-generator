'use strict';

/* Controllers */

angular.module('riskJargonGenerator.controllers', ['riskJargonGenerator.services']).
controller('MyCtrl1', ['$scope', 'Jargon', 'JargonService', '$q', function($scope, Jargon, JargonService, $q) {
  $scope.isCollapsed = true;

  $scope.refresh = function() {
    $scope.sentence = Jargon.generate(jargon);
  }

  $scope.favourite = function() {
    jargon.sentences.addSentence($scope.sentence);
  }

  // Get the collections from our data definitions
  var verbs = new JargonService.verbs();
  var abbreviations = new JargonService.abbreviations();
  var nouns = new JargonService.nouns();
  var adjectives = new JargonService.adjectives();
  var sentences = new JargonService.sentences();

  var jargon =  {
    verbs: verbs,
    abbreviations: abbreviations,
    nouns: nouns,
    adjectives: adjectives,
    sentences: sentences
  };

  // Wait for all promises to resolve before creating initial jargon.
  $q.all([verbs.load(), abbreviations.load(), nouns.load(), adjectives.load()]).then( function() { $scope.sentence = Jargon.generate(jargon)} );
}]).
controller('MyCtrl2', ['$scope', 'JargonService', function($scope, JargonService) {

  // Get the collections from our data definitions
  var verbs = new JargonService.verbs();
  var abbreviations = new JargonService.abbreviations();
  var nouns = new JargonService.nouns();
  var adjectives = new JargonService.adjectives();
  var sentences = new JargonService.sentences();

  $scope.verbs = verbs.models;
  $scope.abbreviations = abbreviations.models;
  $scope.nouns = nouns.models;
  $scope.adjectives = adjectives.models;

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
}]).
controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]).
controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {


  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl'

    });
  };
}]);

