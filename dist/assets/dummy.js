/* jshint ignore:start */

/* jshint ignore:end */

define('dummy/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dummy/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

    'use strict';

    var App;

    Ember['default'].MODEL_FACTORY_INJECTIONS = true;

    App = Ember['default'].Application.extend({
        modulePrefix: config['default'].modulePrefix,
        podModulePrefix: config['default'].podModulePrefix,
        Resolver: Resolver['default']
    });

    loadInitializers['default'](App, config['default'].modulePrefix);

    exports['default'] = App;

});
define('dummy/components/table-component', ['exports', 'ember-bootstrap-table'], function (exports, TableComponent) {

	'use strict';

	exports['default'] = TableComponent['default'].extend();

});
define('dummy/controllers/index', ['exports', 'ember', 'dummy/views/custom-cell', 'dummy/views/custom-header-cell'], function (exports, Em, CustomCell, CustomHeaderCell) {

    'use strict';

    exports['default'] = Em['default'].Controller.extend({
        init: function init() {
            this._super();
            var rows = this.generateRandomRows(100);
            this.set('model', rows);
        },
        randomVal: function randomVal(min, max) {
            return Math.random() * (max - min) + min;
        },
        generateRandomRows: function generateRandomRows(count) {
            var rows = [];
            var i;
            for (i = 0; i < count; i++) {
                rows.push(Em['default'].Object.create({
                    id: i,
                    value: this.randomVal(0, 1000),
                    clicks: Math.round(this.randomVal(100, 500))
                }));
            }
            return rows;
        },
        rows: Em['default'].computed('model.[]', function () {
            return this.get('model');
        }),
        numCols: 2,
        columns: Em['default'].computed('numCols', function () {
            return [Em['default'].Object.create({
                headerCellName: 'ID',
                columnWidth: '100px',
                cellValuePath: 'id',
                cellCustomViewClass: CustomCell['default'],
                headerCellCustomViewClass: CustomHeaderCell['default']
            }), Em['default'].Object.create({
                headerCellName: 'VALUE',
                columnWidth: '200px',
                getCellContent: function getCellContent(row) {
                    return '<div>' + row.get('value') + '</div>';
                },
                sortable: true,
                sortOn: 'cellValuePath',
                cellValuePath: 'value'
            }), Em['default'].Object.create({
                headerCellName: 'CLICKS',
                cellValuePath: 'clicks',
                headerCellInfo: 'Shows the number of clicks!'
            })];
        }),
        actions: {
            loadMore: function loadMore() {
                Em['default'].Logger.debug('LOAD MORE FIRED');
                var currentRows = this.get('model');
                var newRows = this.generateRandomRows(25);
                this.set('model', currentRows.concat(newRows));
            }
        }
    });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/components/table-component.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/components/table-component.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/components/table-component.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/index.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/index.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/index.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/models/table-column.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/models/table-column.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/models/table-column.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/models/table-icons.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/models/table-icons.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/models/table-icons.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/models/table-row.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/models/table-row.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/models/table-row.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-cell.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-cell.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-cell.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-header-cell.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-header-cell.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-header-cell.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-loading.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-loading.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-loading.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-no-content.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-no-content.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-no-content.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-row.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-row.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-row.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-sticky.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-sticky.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-sticky.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-table.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-table.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-table.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-tbody.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-tbody.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-tbody.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-td.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-td.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-td.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-tfoot.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-tfoot.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-tfoot.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-th.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-th.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-th.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-thead.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-thead.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-thead.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/ember-bootstrap-table/tests/modules/ember-bootstrap-table/views/table-tr.jshint', function () {

  'use strict';

  describe('JSHint - modules/ember-bootstrap-table/views/table-tr.js', function () {
    it('should pass jshint', function () {
      expect(true, 'modules/ember-bootstrap-table/views/table-tr.js should pass jshint.').to.be.ok;
    });
  });

});
define('dummy/initializers/app-version', ['exports', 'dummy/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('dummy/initializers/export-application-global', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('dummy/router', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    exports['default'] = Router.map(function () {});

});
define('dummy/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1,"id","title");
        var el2 = dom.createTextNode("Welcome to Ember.js");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('dummy/templates/custom-cell', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "view.row.id");
        return fragment;
      }
    };
  }()));

});
define('dummy/templates/custom-header-cell', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "view.colConfig.headerCellName");
        return fragment;
      }
    };
  }()));

});
define('dummy/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "table-component", [], {"rows": get(env, context, "rows"), "columns": get(env, context, "columns"), "stickyHeader": true, "infiniteScrollEnabled": true, "loadMoreAction": "loadMore"});
        return fragment;
      }
    };
  }()));

});
define('dummy/tests/app.jshint', function () {

  'use strict';

  describe('JSHint - app.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'app.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/blanket-options', function () {

    'use strict';

    /*globals blanket, module */
    var options = {
        modulePrefix: "ember-bootstrap-table",
        filter: "//.*ember-bootstrap-table/.*/",
        antifilter: "//.*(tests|template).*/",
        loaderExclusions: [],
        enableCoverage: true,
        cliOptions: {
            reporters: ["lcov"],
            autostart: true,
            lcovOptions: {
                outputFile: "lcov.dat"
            }
        }
    };
    if (typeof exports === "undefined") {
        blanket.options(options);
    } else {
        module.exports = options;
    }

});
define('dummy/tests/blanket-options.jshint', function () {

  'use strict';

  describe('JSHint - blanket-options.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'blanket-options.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/components/table-component.jshint', function () {

  'use strict';

  describe('JSHint - components/table-component.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'components/table-component.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/controllers/index.jshint', function () {

  'use strict';

  describe('JSHint - controllers/index.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'controllers/index.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/helpers/resolver', ['exports', 'ember/resolver', 'dummy/config/environment'], function (exports, Resolver, config) {

    'use strict';

    var resolver = Resolver['default'].create();

    resolver.namespace = {
        modulePrefix: config['default'].modulePrefix,
        podModulePrefix: config['default'].podModulePrefix
    };

    exports['default'] = resolver;

});
define('dummy/tests/helpers/resolver.jshint', function () {

  'use strict';

  describe('JSHint - helpers/resolver.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'helpers/resolver.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/router', 'dummy/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('dummy/tests/helpers/start-app.jshint', function () {

  'use strict';

  describe('JSHint - helpers/start-app.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'helpers/start-app.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/router.jshint', function () {

  'use strict';

  describe('JSHint - router.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'router.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/test-helper', ['dummy/tests/helpers/resolver', 'ember-mocha'], function (resolver, ember_mocha) {

	'use strict';

	ember_mocha.setResolver(resolver['default']);

});
define('dummy/tests/test-helper.jshint', function () {

  'use strict';

  describe('JSHint - test-helper.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'test-helper.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/unit/components/table-component-test', ['chai', 'mocha', 'ember-mocha', 'ember'], function (chai, mocha, ember_mocha, Em) {

    'use strict';

    window.$.fn.tooltip = function () {};

    ember_mocha.describeComponent('table-component', 'Table Component', {
        unit: true
    }, function () {
        var mockRows, mockColumns, tooltipSpy;
        var MockNoContentView = Em['default'].View.extend({
            classNames: ['mock-no-content-view']
        });

        mocha.beforeEach(function () {
            mockRows = [Em['default'].Object.create({ id: 1, value: '100', date: '2015-05-01' }), Em['default'].Object.create({ id: 2, value: '150', date: '2015-05-02' }), Em['default'].Object.create({ id: 3, value: '300', date: '2015-05-03' })];
            mockColumns = [Em['default'].Object.create({
                headerCellName: 'ID',
                headerCellClassName: 'header-cell',
                headerCellInfo: 'the item id',
                cellValuePath: 'id',
                cellClassName: 'id-cell',
                columnWidth: '100px'
            }), Em['default'].Object.create({
                headerCellName: 'VALUE',
                headerCellClassName: 'header-cell',
                headerCellInfo: 'the item value',
                cellClassName: 'value-cell',
                cellValuePath: 'value',
                columnWidth: '200px'
            }), Em['default'].Object.create({
                headerCellName: 'DATE',
                headerCellClassName: 'header-cell',
                headerCellInfo: 'the item date',
                cellClassName: 'date-cell',
                getCellContent: function getCellContent(row) {
                    return row.get('date');
                },
                columnWidth: '150px'
            })];
            tooltipSpy = sinon.spy($.fn, 'tooltip');
        });

        mocha.afterEach(function () {
            tooltipSpy.restore();
        });

        ember_mocha.it('should render a div, table, thead, tbody, and tfoot', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();
            var $component = component.$();
            var tag = $component.prop('tagName');
            chai.expect(tag).to.eq('DIV');

            var $table = $component.find('.table-component-table'),
                $thead = $table.find('.table-component-thead'),
                $tbody = $table.find('.table-component-tbody'),
                $tfoot = $table.find('.table-component-tfoot');
            chai.expect($table.length).to.eq(1);
            chai.expect($thead.length).to.eq(1);
            chai.expect($tbody.length).to.eq(1);
            chai.expect($tfoot.length).to.eq(1);
        });

        ember_mocha.it('should render sortable headers with a sort button, and that button should fire the sort action when clicked.', function () {
            mockColumns[0].set('sortable', true);
            mockColumns[1].set('sortable', true);
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows,
                sortIndex: 1,
                sortAscending: false
            });
            this.render();
            var $component = component.$();
            var $headerCells = $component.find('.table-component-table .table-component-thead .table-component-th');
            var $cell0Sort = $headerCells.eq(0).find('button'),
                $cell1Sort = $headerCells.eq(1).find('button'),
                $cell2Sort = $headerCells.eq(2).find('button'),
                $cell0Icon = $headerCells.eq(0).find('.table-component-sort-icon'),
                $cell1Icon = $headerCells.eq(1).find('.table-component-sort-icon');
            chai.expect($cell0Sort.length).to.eq(1);
            chai.expect($cell1Sort.length).to.eq(1);
            chai.expect($cell2Sort.length).to.eq(0);

            // should update sortIndex when a new column is clicked.
            Em['default'].run(function () {
                $cell0Sort.click();
            });
            chai.expect(component.get('sortIndex')).to.eq(0);
            chai.expect($cell0Icon.hasClass(component.get('_icons.sortDesc'))).to.be.ok;

            // should update sortAscending when same column is clicked.
            Em['default'].run(function () {
                $cell0Sort.click();
            });
            chai.expect(component.get('sortAscending')).to.be.ok;
            chai.expect($cell0Icon.hasClass(component.get('_icons.sortAsc'))).to.be.ok;

            Em['default'].run(function () {
                $cell1Sort.click();
            });
            chai.expect(component.get('sortIndex')).to.eq(1);
            chai.expect($cell0Icon.hasClass(component.get('_icons.sortAsc'))).not.to.be.ok;
            chai.expect($cell0Icon.hasClass(component.get('_icons.sortDesc'))).not.to.be.ok;
            chai.expect($cell1Icon.hasClass(component.get('_icons.sortAsc'))).to.be.ok;
        });

        ember_mocha.it('should render a table with the correct number of columns (stickyHeader = false)', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();
            var $component = component.$();
            var $headerCells = $component.find('.table-component-table .table-component-thead .table-component-header-cell');
            chai.expect($headerCells.length).to.eq(mockColumns.length);
            mockColumns.forEach(function (col, idx) {
                var $cell = Em['default'].$($headerCells[idx]);
                chai.expect($cell.css('width')).to.eq(col.get('columnWidth'));
            });
        });

        ember_mocha.it('should render a table and a sticky header table with correct number of columns (stickyHeader = true)', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows,
                stickyHeader: true
            });
            this.render();
            var $component = component.$();
            var $stickyHeaderCells = $component.find('.table-component-sticky-header-table .table-component-thead .table-component-header-cell');
            var $headerCells = $component.find('.table-component-table .table-component-thead .table-component-header-cell');
            chai.expect($headerCells.length).to.eq(0);
            chai.expect($stickyHeaderCells.length).to.eq(mockColumns.length);
            mockColumns.forEach(function (col, idx) {
                var $cell = Em['default'].$($stickyHeaderCells[idx]);
                chai.expect($cell.css('width')).to.eq(col.get('columnWidth'));
            });
        });

        ember_mocha.it('should render the header cells with a custom view in the cell if headerCellCustomViewClass is present.', function () {
            var mockView = Em['default'].View.extend({
                classNames: ['custom-header-cell']
            });
            mockColumns[0].set('headerCellCustomViewClass', mockView);
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();
            var $component = component.$();
            var $headerCells = $component.find('.table-component-table .table-component-thead .table-component-header-cell');
            chai.expect($headerCells.length).to.eq(mockColumns.length);

            var $firstCell = Em['default'].$($headerCells[0]),
                $customView = $firstCell.find('.custom-header-cell');
            chai.expect($customView.length).to.eq(1);
        });

        ember_mocha.it('should render a noContentView, and hides the table when there are no rows, and should do the reverse when there ' + 'are rows.', function () {
            // NoContentView shown, and table hidden when there are no rows:
            var component = this.subject({
                rows: [],
                noContentView: MockNoContentView
            });
            this.render();
            var $component = component.$();
            var $ncv = $component.find('.mock-no-content-view');
            var $tableContainer = $component.find('.table-component-table-container');
            chai.expect($ncv.length).to.eq(1);
            chai.expect($tableContainer.hasClass('hidden')).to.be.ok;

            // NoContentView removed when rows exist, and table visible.
            Em['default'].run(function () {
                component.set('rows', mockRows);
            });
            $component = component.$();
            $ncv = $component.find('.mock-no-content-view');
            $tableContainer = $component.find('.table-component-table-container');
            chai.expect($ncv.length).to.eq(0);
            chai.expect($tableContainer.hasClass('hidden')).not.to.be.ok;
        });

        ember_mocha.it('should render a row for each object in the rows array, and each row should have the correct cell content & configuration', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();

            var $component = component.$();
            var $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
            chai.expect($rows.length).to.eq(mockRows.length);

            mockRows.forEach(function (mockRow, idx) {
                var $row = Em['default'].$($rows[idx]);
                var $cells = $row.find('.table-component-td'),
                    $idCell = $cells.eq(0),
                    $valueCell = $cells.eq(1),
                    $dateCell = $cells.eq(2);

                var id = Em['default'].$.trim($idCell.text()),
                    value = Em['default'].$.trim($valueCell.text()),
                    date = Em['default'].$.trim($dateCell.text());

                chai.expect($idCell.hasClass('id-cell')).to.be.ok;
                chai.expect($valueCell.hasClass('value-cell')).to.be.ok;
                chai.expect($dateCell.hasClass('date-cell')).to.be.ok;

                chai.expect(id).to.eq(mockRow.get('id').toString());
                chai.expect(value).to.eq(mockRow.get('value').toString());
                chai.expect(date).to.eq(mockRow.get('date').toString());
            });
        });

        ember_mocha.it('should render columns with custom view inside cell if the column has cellCustomViewClass.', function () {
            var mockView = Em['default'].View.extend({
                classNames: ['table-custom-cell-view']
            });
            mockColumns[0].set('cellCustomViewClass', mockView);
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();

            var $component = component.$();
            var $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
            chai.expect($rows.length).to.eq(mockRows.length);

            var $row = Em['default'].$($rows[0]);
            var $cells = $row.find('.table-component-td'),
                $cell = $cells.eq(0),
                $customView = $cell.find('.table-custom-cell-view');

            chai.expect($customView.length).to.eq(1);
        });

        ember_mocha.it('should render a loading row, and loading cell in the table footer infiniteScrollEnabled is true', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows,
                infiniteScrollEnabled: true,
                isLoadingRows: true
            });
            this.render();

            var $component = component.$();
            var $loadingCell = $component.find('.table-component-table .table-component-tfoot .table-component-loading-row .table-component-td');
            chai.expect($loadingCell.length).to.eq(1);

            var $loadingIcon = $loadingCell.find('.table-component-loading-icon');
            chai.expect($loadingIcon.length).to.eq(1);
        });

        ember_mocha.it('should re-render the thead and tbody when the columns change', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();

            var newCols = mockColumns.slice(0, 1);
            Em['default'].run(function () {
                component.set('columns', newCols);
            });
            var $component = component.$();
            var $headers = $component.find('.table-component-table .table-component-thead .table-component-th');
            var $row0Cells = $component.find('.table-component-table .table-component-tbody .table-component-tr').eq(0).find('.table-component-td');
            chai.expect($headers.length).to.eq(1);
            chai.expect($row0Cells.length).to.eq(1);
        });

        ember_mocha.it('should re-render the sticky-header table, and the table tbody when columns change and stickyHeader is true.', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows,
                stickyHeader: true
            });
            this.render();

            var newCols = mockColumns.slice(0, 1);
            Em['default'].run(function () {
                component.set('columns', newCols);
            });
            var $component = component.$();
            var $headers = $component.find('.table-component-sticky-header-container .table-component-sticky-header-table .table-component-thead .table-component-th');
            var $row0Cells = $component.find('.table-component-table .table-component-tbody .table-component-tr').eq(0).find('.table-component-td');
            chai.expect($headers.length).to.eq(1);
            chai.expect($row0Cells.length).to.eq(1);
        });

        ember_mocha.it('#_loadMoreRows should send the loadMoreAction if it exists, and isLoadingRows is false', function () {
            var component = this.subject({
                loadMoreAction: 'loadMoreAction',
                isLoadingRows: false
            });
            var spy = sinon.spy(component, 'sendAction');
            component._loadMoreRows();
            chai.expect(spy.calledWith('loadMoreAction')).to.be.ok;
        });

        ember_mocha.it('table should re-render when rows array changes', function () {
            var component = this.subject({
                columns: mockColumns,
                rows: mockRows
            });
            this.render();

            var $component = component.$();
            var $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
            chai.expect($rows.length).to.eq(mockRows.length);

            Em['default'].run(function () {
                mockRows.push(Em['default'].Object.create({ id: 4, value: '500', date: '2015-05-06' }));
                mockRows.push(Em['default'].Object.create({ id: 5, value: '750', date: '2015-05-08' }));
                component.set('rows', mockRows);
                component.notifyPropertyChange('rows');
            });
            $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
            chai.expect($rows.length).to.eq(mockRows.length);
        });

        ember_mocha.it('should initialize tooltip for each header cell if showTooltips is true, and the columns have headerCellInfo', function () {
            this.subject({
                columns: mockColumns,
                rows: mockRows,
                showTooltips: true
            });
            this.render();
            chai.expect(tooltipSpy.callCount).to.eq(mockColumns.length);
        });
    });

});
define('dummy/tests/unit/components/table-component-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/components/table-component-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/components/table-component-test.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/unit/models/table-column-test', ['chai', 'mocha', 'ember', 'ember-bootstrap-table/models/table-column'], function (chai, mocha, Em, TableColumn) {

    'use strict';

    mocha.describe('Table Column', function () {

        var mockRows, mockColumn;
        mocha.beforeEach(function () {
            mockColumn = {
                cellValuePath: 'value'
            };
            mockRows = [{ id: 0, value: 100 }, { id: 1, value: 500 }, { id: 2, value: 250 }, { id: 3, value: 250 }];
        });

        mocha.it('should exist, and be an Em.Object.', function () {
            var column = TableColumn['default'].create();
            chai.expect(column).to.be.an['instanceof'](Em['default'].Object);
        });

        mocha.it('#sort should just return the rows if neither cellValuePath nor getCellContent are defined on the column', function () {
            delete mockColumn.cellValuePath;
            var column = TableColumn['default'].create();
            var sorted = column.sort(mockColumn, mockRows);
            chai.expect(sorted).to.eql(mockRows);
        });

        mocha.it('#sort should convert an ember-data record array to a regular array before sorting if rows is an ember-data array.', function () {
            var column = TableColumn['default'].create();
            var mockRecordArray = Em['default'].Object.create({
                content: mockRows
            });
            var sorted = column.sort(mockColumn, mockRecordArray);
            chai.expect(sorted).to.eql(mockRows);
        });

        mocha.it('#sort should use getCellContent if it is defined on the column', function () {
            mockColumn.getCellContent = function (row) {
                return row.value;
            };
            var spy = sinon.spy(mockColumn, 'getCellContent');
            var column = TableColumn['default'].create();
            var expected = [mockRows[0], mockRows[2], mockRows[3], mockRows[1]];
            var sorted = column.sort(mockColumn, mockRows, true);
            chai.expect(spy.called).to.be.ok;
            chai.expect(sorted).to.eql(expected);
        });

        mocha.it('#sort should use cellValuePath instead of getCellContent if sortOn is cellValuePath', function () {
            mockColumn.getCellContent = function (row) {
                return row.value;
            };
            mockColumn.sortOn = 'cellValuePath';
            var spy = sinon.spy(mockColumn, 'getCellContent');
            var column = TableColumn['default'].create();
            var expected = [mockRows[0], mockRows[2], mockRows[3], mockRows[1]];
            var sorted = column.sort(mockColumn, mockRows, true);
            chai.expect(spy.called).not.to.be.ok;
            chai.expect(sorted).to.eql(expected);
        });

        mocha.it('#sort should sort in ascending order when isAscending is true.', function () {
            var column = TableColumn['default'].create();
            // test ascending:
            var expectedAsc = [mockRows[0], mockRows[2], mockRows[3], mockRows[1]];
            var sortedAsc = column.sort(mockColumn, mockRows, true);
            chai.expect(sortedAsc).to.eql(expectedAsc);
        });

        mocha.it('#sort should sort in descending order when isAscending is false.', function () {
            var column = TableColumn['default'].create();
            // test descending:
            var expectedDesc = [mockRows[1], mockRows[2], mockRows[3], mockRows[0]];
            var sortedDesc = column.sort(mockColumn, mockRows, false);
            chai.expect(sortedDesc).to.eql(expectedDesc);
        });

        mocha.it('#_hasTooltipText should return true if headerCellInfo is populated, and false otherwise', function () {
            var column = TableColumn['default'].create({
                headerCellInfo: 'tooltip text!'
            });
            chai.expect(column.get('_hasTooltipText')).to.be.ok;

            Em['default'].run(function () {
                column.set('headerCellInfo', '');
            });
            chai.expect(column.get('_hasTooltipText')).not.to.be.ok;
        });
    });

});
define('dummy/tests/unit/models/table-column-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/models/table-column-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/models/table-column-test.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/unit/models/table-icons-test', ['chai', 'mocha', 'ember', 'ember-bootstrap-table/models/table-icons'], function (chai, mocha, Em, TableIcons) {

    'use strict';

    mocha.describe('Table Icons', function () {

        mocha.it('should exist, and be an Em.Object.', function () {
            var icons = TableIcons['default'].create();
            chai.expect(icons).to.be.an['instanceof'](Em['default'].Object);
        });
    });

});
define('dummy/tests/unit/models/table-icons-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/models/table-icons-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/models/table-icons-test.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/unit/models/table-row-test', ['chai', 'mocha', 'ember', 'ember-bootstrap-table/models/table-row'], function (chai, mocha, Em, TableRow) {

    'use strict';

    mocha.describe('Table Row', function () {

        mocha.it('should exist, and be an Em.ObjectProxy.', function () {
            var row = TableRow['default'].create();
            chai.expect(row).to.be.an['instanceof'](Em['default'].ObjectProxy);
        });
    });

});
define('dummy/tests/unit/models/table-row-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/models/table-row-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/models/table-row-test.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/views/custom-cell.jshint', function () {

  'use strict';

  describe('JSHint - views/custom-cell.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'views/custom-cell.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/tests/views/custom-header-cell.jshint', function () {

  'use strict';

  describe('JSHint - views/custom-header-cell.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'views/custom-header-cell.js should pass jshint.').to.be.ok; 
  })});

});
define('dummy/views/custom-cell', ['exports', 'ember'], function (exports, Em) {

    'use strict';

    exports['default'] = Em['default'].View.extend({
        tagName: 'div',
        classNames: ['custom-cell-view'],
        templateName: 'custom-cell'
    });

});
define('dummy/views/custom-header-cell', ['exports', 'ember'], function (exports, Em) {

    'use strict';

    exports['default'] = Em['default'].View.extend({
        tagName: 'div',
        classNames: ['custom-header-cell-view'],
        templateName: 'custom-header-cell'
    });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dummy/tests/test-helper");
} else {
  require("dummy/app")["default"].create({"name":"ember-bootstrap-table","version":"v2.0.14"});
}

/* jshint ignore:end */
//# sourceMappingURL=dummy.map