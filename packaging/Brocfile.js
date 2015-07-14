/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
// TODO(azirbel): This is deprecated
var pickFiles = require('broccoli-static-compiler');
// TODO(azirbel): Deprecated, remove and use es6modules
var compileES6 = require('broccoli-es6-concatenator');
var es3Safe = require('broccoli-es3-safe-recast');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var less = require('broccoli-less-single');
var wrap = require('./wrap');
var globals = require('./globals');

var addonTree = pickFiles('addon', {
    srcDir: '/',
    destDir: 'ember-bootstrap-table'
});

// Compile templates
var templateTree = templateCompiler('addon/templates', { module: true });
templateTree = pickFiles(templateTree, {srcDir: '/', destDir: 'ember-bootstrap-table/templates'});

var sourceTree = mergeTrees([templateTree, addonTree], {overwrite: true});

// Does a few things:
//   - Generate global exports, like Ember.Table.EmberTableComponent
//   - Register all templates on Ember.TEMPLATES
//   - Register views and components with the container so they can be looked up
// Output goes into globals-output.js
var globalExports = globals(pickFiles(sourceTree, {srcDir: '/ember-bootstrap-table', destDir: '/'}));

// Require.js module loader
var loader = pickFiles('bower_components', {srcDir: '/loader.js', destDir: '/'});

var jsTree = mergeTrees([sourceTree, globalExports, loader]);

// Transpile modules
var compiled = compileES6(jsTree, {
    wrapInEval: false,
    loaderFile: 'loader.js',
    inputFiles: ['ember-bootstrap-table/**/*.js'],
    ignoredModules: ['ember'],
    outputFile: '/ember-bootstrap-table.js',
    legacyFilesToAppend: ['globals-output.js']
});

// Wrap in a function which is executed
compiled = wrap(compiled);

// Compile LESS
var lessTree = pickFiles('app/styles', { srcDir: '/', destDir: '/' });
var lessMain = 'ember-bootstrap-table.less';
var lessOutput = 'ember-bootstrap-table.css';
lessTree = less(lessTree, lessMain, lessOutput);

module.exports = mergeTrees([es3Safe(compiled), lessTree]);
