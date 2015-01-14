module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n"
      },
      build: {
        src: [
          'src/main.js'
        ],
        dest: 'build/main.js'
      },
      dist: {
        src: [
          'build/**/*.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: [        
        'build/<%= pkg.name.replace(".js", "") %>.js'
      ],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc',        
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['concat', 'jshint']
    },
    emberTemplates: {
      options: {
        templateName: function(sourceFile) {
          return 'table-component-template-'+sourceFile.replace(/src\//, '');
        }
      },
      'build/templates.js': ["src/**/*.hbs"]
    },
    qunit: {
      all: ['tests/*.html']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'emberTemplates']);
  grunt.registerTask('test', ['qunit']);
};