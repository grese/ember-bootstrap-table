module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      css: {
        files: [
          {src: ['src/stylesheets/*.css'], dest: 'dist/<%= pkg.name.replace(".css", "") %>.css'}
        ]
      }
    },
    concat: {
      options: {
        separator: "\n\n"
      },
      build: {
        src: [
          'src/javascript/**/*.js'
        ],
        dest: 'build/javascript.js'
      },
      dist: {
        src: [
          'build/**/*.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'  
      }
    },
    jshint: {
      files: [
        'src/**/*.js',
        'tests/spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    emberTemplates: {
      options: {
        templateName: function(sourceFile) {
          var template = sourceFile.replace('src/templates/', '').replace('/', '-');
          return 'ember-bootstrap-table-template-' + template;
        }
      },
      'build/templates.js': ["src/**/*.hbs"]
    },
    clean: ['build', 'dist']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  // default task just builds & dists the package.
  grunt.registerTask('default', ['jshint', 'clean', 'emberTemplates', 'concat:build', 'concat:dist', 'uglify', 'copy:css']);
  // test task builds, tests, and then dists the package.
  grunt.registerTask('test', ['jshint', 'clean', 'emberTemplates', 'concat:build', 'karma', 'concat:dist', 'uglify', 'copy:css']);
};