/*globals blanket, module */
var options = {
    modulePrefix: "ember-bootstrap-table",
    filter: "//.*ember-bootstrap-table/.*/",
    antifilter: "//.*(tests|template).*/",
    loaderExclusions: [],
    enableCoverage: true,
    cliOptions: {
        reporters: ['lcov'],
        autostart: true,
        lcovOptions: {
            outputFile: 'lcov.dat'
        }
    }
};
if (typeof exports === 'undefined') {
    blanket.options(options);
} else {
    module.exports = options;
}
