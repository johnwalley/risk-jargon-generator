'use strict';

/* Services */

angular.module('riskJargonGenerator.services', []).
  value('version', '0.2').
  factory('Jargon',
    function() {
    var constructs = [{
      types: ["verb", "adjective", "abbreviation", "noun"],
      structure: "We need to {0} the {1} {2} {3}!"
    }, {
      types: ["verb", "abbreviation", "noun", "verb", "adjective", "noun"],
      structure: "Try to {0} the {1} {2} - maybe it will {3} the {4} {5}!"
    }, {
      types: ["adjective", "noun", "verb", "abbreviation", "noun"],
      structure: "The {0} {1} should {2} our {3} {4}!"
    }, {
      types: ["noun", "verb", "adjective", "noun", "verb", "adjective", "abbreviation"],
      structure: "Going forward the {0} will {1} the {2} {3} but we should {4} the {5} {6}!"
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
  }).
  factory('History',
    function() {

    var obj = {};

    var history = [];

    obj.history = history;

    obj.Update = function(sentence) {
      history.push(sentence);
      obj.current = sentence;
    }

    obj.Jump = function(sentence) {
      obj.current = sentence;
    }

    return { history: obj };
});


angular.module('ParseServices', []).
  factory('ExtendParseSDK', ['ParseAbstractService',
  function(ParseAbstractService) {

    Parse.Object.extendAngular = function(options) {
      return ParseAbstractService.EnhanceObject(Parse.Object.extend(options));
    };

    Parse.Collection.extendAngular = function(options) {
      return ParseAbstractService.EnhanceCollection(Parse.Collection.extend(options));
    };

  }
]).
  factory('ParseSDK', function() {

  // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
  Parse.initialize("prP3hizyid9MPKOEZaus97jg0GbNCUkTJd44Elai", "qMn3rd66bA8eLyuYPLJP4I3ZNo5qvVklNUOKH0Bp");
});

angular.module('ParseServices')

.factory('ParseQueryAngular',['$q','$timeout',function ($q, $timeout) { 


  // we use $timeout 0 as a trick to bring resolved promises into the Angular digest
  var angularWrapper = $timeout;

	return function(query,options) {

      // if unspecified, the default function to call is 'find'
      var functionToCall = "find";
      if (!_.isUndefined(options) && !_.isUndefined(options.functionToCall)) {
        functionToCall = options.functionToCall;
      }

      // create a promise to return
      var defer = $q.defer();
      
      // this is the boilerplate stuff that you would normally have to write for every Parse call
      var defaultParams = [{
        success:function(data) {

          /* We're using $timeout as an "angular wrapper" that will force a digest
          * and kind of bring back the data in Angular realm.
          * You could use the classic $scope.$apply as well but here we don't need
          * to pass any $scope as a parameter.
          * Another trick is to inject $rootScope and use $apply on it, but well, $timeout is sexy.
          */
          angularWrapper(function(){
            defer.resolve(data);
          });
        },
        error:function(data,err) {
          angularWrapper(function(){
            defer.reject(err);
          });
        }
      }];
      // Pass custom params if needed.
      if (options && options.params) {
        defaultParams = options.params.concat(defaultParams);
      }
      if (options && options.mergeParams) {
        defaultParams[0] = _.extend(defaultParams[0],options.mergeParams);
      }

      // this is where the async call is made outside the Angular digest
      query[functionToCall].apply(query,defaultParams);

      return defer.promise;

    };

}]);  

angular.module('ExternalDataServices',[]) 

.factory('ParseAbstractService', ['ParseQueryAngular', function(ParseQueryAngular) {
	/********
		This service provides an enhanced Parse.Object and Parse.Collection
		So we can call load and saveParse from any extending Class and have that wrapped
		within ParseQueryAngular
	**********/


	var object = function(originalClass) {
		originalClass.prototype = _.extend(originalClass.prototype,{
			load:function() {
				return ParseQueryAngular(this,{functionToCall:"fetch"});
			},
			saveParse:function(data) {
				if (data && typeof data == "object") this.set(data);
				return ParseQueryAngular(this,{functionToCall:"save", params:[null]});
			}
		});
		return originalClass;
	};

	var collection = function(originalClass){
		originalClass.prototype = _.extend(originalClass.prototype,{
			load:function() {
				return ParseQueryAngular(this,{functionToCall:"fetch"});
			}
		});
		return originalClass;
	};


	return {
		EnhanceObject:object,
		EnhanceCollection:collection
	};

}]);

// reference the module we declared earlier
angular.module('ExternalDataServices')

// add a factory
.factory('JargonService', ['ParseQueryAngular',
  function(ParseQueryAngular) {

    var Verb = Parse.Object.extendAngular({
      className: "Verb",
      setWord: function(word) {
        this.set('word', word);
        return this;
      },
      getWord: function() {
        return this.get('word');
      },
      destroyParse: function() {
        return ParseQueryAngular(this, {
          functionToCall: "destroy"
        });
      }
    });

    var Abbreviation = Parse.Object.extendAngular({
      className: "Abbreviation",
      setWord: function(word) {
        this.set('word', word);
        return this;
      },
      getWord: function() {
        return this.get('word');
      },
      destroyParse: function() {
        return ParseQueryAngular(this, {
          functionToCall: "destroy"
        });
      }
    });

    var Noun = Parse.Object.extendAngular({
      className: "Noun",
      setWord: function(word) {
        this.set('word', word);
        return this;
      },
      getWord: function() {
        return this.get('word');
      },
      destroyParse: function() {
        return ParseQueryAngular(this, {
          functionToCall: "destroy"
        });
      }
    });

    var Adjective = Parse.Object.extendAngular({
      className: "Adjective",
      setWord: function(word) {
        this.set('word', word);
        return this;
      },
      getWord: function() {
        return this.get('word');
      },
      destroyParse: function() {
        return ParseQueryAngular(this, {
          functionToCall: "destroy"
        });
      }
    });

    var Verbs = Parse.Collection.extendAngular({
      model: Verb,
      comparator: function(model) {
        return model.attributes.word.toLowerCase();
      },
      addWord: function(word) {
        // save request_id to Parse
        var _this = this;

        var verb = new Verb();
        verb.setWord(word);

        // use the extended Parse SDK to perform a save and return the promised object back into the Angular world
        return verb.saveParse().then(function(data) {
          _this.add(data);
        })
      },
      removeWord: function(word) {
        if (!this.get(word)) return false;
        var _this = this;
        return word.destroyParse().then(function() {
          _this.remove(word);
        });
      }
    });

    var Abbreviations = Parse.Collection.extendAngular({
      model: Abbreviation,
      comparator: function(model) {
        return model.attributes.word.toLowerCase();
      },
      addWord: function(word) {
        // save request_id to Parse
        var _this = this;

        var abbreviation = new Abbreviation();
        abbreviation.setWord(word);

        // use the extended Parse SDK to perform a save and return the promised object back into the Angular world
        return abbreviation.saveParse().then(function(data) {
          _this.add(data);
        })
      },
      removeWord: function(word) {
        if (!this.get(word)) return false;
        var _this = this;
        return word.destroyParse().then(function() {
          _this.remove(word);
        });
      }
    });

    var Nouns = Parse.Collection.extendAngular({
      model: Noun,
      comparator: function(model) {
        return model.attributes.word.toLowerCase();
      },
      addWord: function(word) {
        // save request_id to Parse
        var _this = this;

        var noun = new Noun();
        noun.setWord(word);

        // use the extended Parse SDK to perform a save and return the promised object back into the Angular world
        return noun.saveParse().then(function(data) {
          _this.add(data);
        })
      },
      removeWord: function(word) {
        if (!this.get(word)) return false;
        var _this = this;
        return word.destroyParse().then(function() {
          _this.remove(word);
        });
      }
    });

    var Adjectives = Parse.Collection.extendAngular({
      model: Adjective,
      comparator: function(model) {
        return model.attributes.word.toLowerCase();
      },
      addWord: function(word) {
        // save request_id to Parse
        var _this = this;

        var adjective = new Adjective();
        adjective.setWord(word);

        // use the extended Parse SDK to perform a save and return the promised object back into the Angular world
        return adjective.saveParse().then(function(data) {
          _this.add(data);
        })
      },
      removeWord: function(word) {
        if (!this.get(word)) return false;
        var _this = this;
        return word.destroyParse().then(function() {
          _this.remove(word);
        });
      }
    });


    // Return a simple API
    return {
      verbs: Verbs,
      abbreviations: Abbreviations,
      nouns: Nouns,
      adjectives: Adjectives,
    };
  }
]);


