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
    },
    uglify: {
      build: {
        src : ['./fontmarklet.js'],
        dest : 'release/<%= pkg.version %>/fontmarklet.min.js',
      },
      options: {
        report : 'gzip',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
      }
    },
    copy: {
      latest: {
        files: [
          {
            expand:true,
            flatten: true,
            src: ['release/<%= pkg.version %>/*'],
            dest: 'release/latest/'
        }
        ]
      }
    }
  });

  grunt.registerTask('dev', ['browserify']);

  grunt.registerTask('release', ['browserify', 'uglify', 'copy']);

  grunt.registerTask('default', ['watch']);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
};
