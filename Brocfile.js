/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var fs = require('fs');

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

var app = new EmberAddon({
    /*
     * Replace patterns. We use this to replace strings such as:
     * @@{controllers/file.js}
     * With the content of those files.
     */
    replace: {
        files: [
            '**/*.js'
        ],
        patterns: [{
            match: /@@{([^}]*)}/g,
            replacement: function(matchedText) {
                filename = matchedText.slice(3, -1);
                fullFilename = './tests/dummy/app/' + filename;
                fileContents = fs.readFileSync(fullFilename, 'utf8');
                return escapeHtml(fileContents).replace(/\n/g, '\\n');
            }
        }]
    }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
