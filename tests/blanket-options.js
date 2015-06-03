/*globals blanket, module */
var options = {
    modulePrefix: "ember-cli-bootstrap-table",
    filter: "//.*ember-cli-bootstrap-table/.*/",
    antifilter: "//.*(tests|template).*/",
    loaderExclusions: [],
    enableCoverage: true,
    cliOptions: {
        reporters: ['json']
    }
};
if (typeof exports === 'undefined') {
    blanket.options(options);
} else {
    module.exports = options;
}
