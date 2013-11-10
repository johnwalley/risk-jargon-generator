'use strict';


// Declare app level module which depends on filters, and services
  var riskJargonGenerator = angular.module('riskJargonGenerator', ['ui.router', 'ui.bootstrap', "ParseServices", "ExternalDataServices"]);

  riskJargonGenerator.factory('Jargon', function() {

    var constructs = [{
      types: ["verb", "adjective", "abbreviation", "noun"],
      structure: "We need to {0} the {1} {2} {3}!"
    }, {
      types: ["verb", "abbreviation", "noun", "verb", "adjective", "noun"],
      structure: "Try to {0} the {1} {2} - maybe it will {3} the {4} {5}!"
    }];

    var jargon = {};

    jargon.constructs = constructs;

    jargon.generate = function(x) {
      var construct = jargon.constructs[Math.floor(Math.random() * jargon.constructs.length)];
      var sentence = construct.structure;

      jargon.verbs = _.map(x.verbs.models, function(m) {
        return m.getWord()
      });
      jargon.abbreviations = _.map(x.abbreviations.models, function(m) {
        return m.getWord()
      });
      jargon.nouns = _.map(x.nouns.models, function(m) {
        return m.getWord()
      });
      jargon.adjectives = _.map(x.adjectives.models, function(m) {
        return m.getWord()
      });

      for (var i = 0; i < construct.types.length; i++) {

        var words = jargon[construct.types[i] + "s"];
        var wordIndex = Math.floor(Math.random() * words.length);

        var word = words[wordIndex];

        sentence = sentence.replace("{" + i + "}", word);
      }

      return sentence;
    }

    return jargon
  });

  riskJargonGenerator.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, send to /jargon
    $urlRouterProvider.otherwise("/jargon")

    $stateProvider
      .state('jargon', {
        url: "/jargon",
        templateUrl: "partials/jargon.html",
        resolve: {
          'jargon': ['JargonService',
            function(JargonService) {

              // Get the collections from our data definitions
              var verbs = new JargonService.verbs();
              var abbreviations = new JargonService.abbreviations();
              var nouns = new JargonService.nouns();
              var adjectives = new JargonService.adjectives();
              var sentences = new JargonService.sentences();

              // Use the extended Parse SDK to load the whole collection
              verbs.load();
              abbreviations.load();
              nouns.load();
              adjectives.load();
              sentences.load();

              return {
                verbs: verbs,
                abbreviations: abbreviations,
                nouns: nouns,
                adjectives: adjectives,
                sentences: sentences
              }
            }
          ]
        },
        controller: function($scope, Jargon, jargon) {
          $scope.isCollapsed = true;

          $scope.refresh = function() {
            $scope.sentence = Jargon.generate(jargon);
          }

          $scope.favourite = function() {
            jargon.sentences.addSentence($scope.sentence);
          }

          Jargon.generate(jargon);
        }
      })
      .state('jargon.list', {
        url: "/list",
        templateUrl: "partials/jargon.list.html",
        controller: function($scope, jargon) {

          $scope.verbs = jargon.verbs.models;
          $scope.abbreviations = jargon.abbreviations.models;
          $scope.nouns = jargon.nouns.models;
          $scope.adjectives = jargon.adjectives.models;

          $scope.addVerb = function() {
            jargon.verbs.addWord($scope.newverb)
          };

          $scope.addAbbreviation = function() {
            jargon.abbreviations.addWord($scope.newabbreviation)
          };

          $scope.addNoun = function() {
            jargon.nouns.addWord($scope.newnoun)
          };

          $scope.addAdjective = function() {
            jargon.adjectives.addWord($scope.newadjective)
          };
        }
      })
      .state('about', {
        url: "/about",
        templateUrl: "partials/about.html"
      })

  });

  riskJargonGenerator.run(['ParseSDK', 'ExtendParseSDK', '$rootScope', '$state', '$stateParams',
    function(ParseService, ExtendParseSDK, $rootScope, $state, $stateParams) {

      // Parse is initialised by injecting the ParseService into the Angular app
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]);
