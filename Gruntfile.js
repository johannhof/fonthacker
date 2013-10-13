module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['./src/**/*.js'],
      tasks: ['browserify'],
    },
    browserify: {
      dist: {
        files: {
          'fontmarklet.js': ['./src/**/*.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
};
