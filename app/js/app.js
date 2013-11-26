'use strict';

// Declare app level module which depends on filters, and services
angular.module('riskJargonGenerator', [
	'riskJargonGenerator.controllers',
  'riskJargonGenerator.services',
  'riskJargonGenerator.directives',
  'ui.router',
  'ui.bootstrap',
  'ParseServices',
  'ExternalDataServices'
]).
config(function($stateProvider, $urlRouterProvider) {

  // For any unmatched url, send to /jargon
  $urlRouterProvider.otherwise("/jargon");

  $stateProvider
  .state('jargon', {
  	url: "/jargon",
  	templateUrl: "partials/jargon.html",
  	controller: 'JargonCtrl'
  })
  .state('jargon.list', {
  	url: "/list",
  	templateUrl: "partials/jargon.list.html",
  	controller: 'JargonListCtrl'
  })
  .state('about', {
  	url: "/about",
  	templateUrl: "partials/about.html"
  })
}).
run(['ParseSDK', 'ExtendParseSDK', '$rootScope', '$state', '$stateParams',
function(ParseService, ExtendParseSDK, $rootScope, $state, $stateParams) {

    // Parse is initialised by injecting the ParseService into the Angular app
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
  ]);
