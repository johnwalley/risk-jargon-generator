module.exports = function(grunt) {
  
  grunt.initConfig({
    'gh-pages': {
      options: {
        base: 'app'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-gh-pages');

};