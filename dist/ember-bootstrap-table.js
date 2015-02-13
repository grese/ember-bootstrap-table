(function(){
	'use strict';

	// The default configuration for a column object:
	var DefaultColumnConfig = Ember.Object.extend({
		headerCellName: '',
		headerCellClassName: null,
		headerCellCustomViewClass: null,
		headerCellInfo: null,
		cellValuePath: null,
		cellClassName: null,
		cellCustomViewClass: null,
		getCellContent: null,
		columnWidth: null,
		_columnIndex: 0,
		sortOn: null,
		sort: function(column, rows, isAscending){
			rows = rows || [];
			column = column || Em.Object.create();
			var getCellContent = column.get('getCellContent'),
				valuePath = column.get('cellValuePath'),
				sortOnCellValuePath = column.get('sortOn') && (column.get('sortOn') === 'cellValuePath');
			if(!rows.sort && rows.get('content')){
				rows = rows.get('content');
			}

			if(!valuePath && !getCellContent){
				Em.Logger.warn('<Warning:> Table component\'s default sorting function requires that either ' +
				'cellValuePath or getCellContent are specified for each sortable column.  ' +
				'You must either specify one of these params to ' +
				'return the value for this column, or override this column\'s sort function. ', column);
				return rows;
			}
			if(getCellContent && !sortOnCellValuePath){
				return rows.sort(function(a, b){
					var aVal = getCellContent(a),
						bVal = getCellContent(b);
					if(isAscending){
						if(aVal < bVal){ return -1; }
						if(aVal > bVal){ return 1; }
					}else{
						if(aVal > bVal){ return -1; }
						if(aVal < bVal){ return 1; }
					}
					return 0;
				});
			}else{
				return rows.sort(function(a, b){
					var aVal = a.get(valuePath),
						bVal = b.get(valuePath);
					if(isAscending){
						if(aVal < bVal){ return -1; }
						if(aVal > bVal){ return 1; }
					}else{
						if(aVal > bVal){ return -1; }
						if(aVal < bVal){ return 1; }
					}
					return 0;
				});
			}
		},
		_hasTooltipText: function(){
			return this.get('headerCellInfo') ? true : false;
		}.property('headerCellInfo')
	});

	var RowObject = Ember.ObjectProxy.extend({
		_rowDetailVisible: false,
		_rowIndex: null
	});

	// The component :)
	var TableComponent = Ember.Component.extend({
		layoutName: 'ember-bootstrap-table-template-main',
		detailRowViewClass: null,
		hasDetailRows: false,
		showTooltips: true,
		useDefaultDetailRowToggle: true,
		showHeader: true,
		hoverable: true,
		striped: false,
		condensed: false,
		responsive: true,
		bordered: false,
		sortAction: null,
		sortIndex: null,
		sortAscending: true,
		infiniteScrollEnabled: false,
		noContentView: null,
		_hasNoContentView: function(){
			return this.get('noContentView') !== null;
		}.property('noContentView'),
		_showNoContentView: function(){
			return this.get('_hasNoContentView') && !this.get('_hasRows');
		}.property('_hasNoContentView', 'rows.[]'),
		_hasRows: function(){
			return this.get('rows') && this.get('rows.length') > 0;
		}.property('rows.[]'),
		_sortIndex: function(){
			return (this.get('sortIndex') !== null) ? this.get('sortIndex') : 0;
		}.property('sortIndex'),
		_columns: function(){
			var idx = 0;
			if(this.get('columns')){
				return this.get('columns').map(function(column){
					var col = DefaultColumnConfig.create(column);
					col.set('_columnIndex', idx++);
					return col;
				});
			}else{
				Em.Logger.warn('<WARNING>: Column configurations must be provided to table component');
				return [];
			}
		}.property('columns.[]'),
		_numColumns: function(){
			return this.get('columns').length;
		}.property('columns.[]'),
		_rowColspan: function(){
			if(this.get('useDefaultDetailRowToggle')){
				// extra column for the detailView toggle
				return this.get('_numColumns') + 1;
			}else{
				return this.get('_numColumns');
			}
		}.property('columns.[]'),
		_detailRowsEnabled: function(){
			var enabled = false;
			if(this.get('hasDetailRows')){
				if(this.get('detailRowViewClass') !== null){
					enabled = true;
				}else{
					Em.Logger.warn('<WARNING>: when hasDetailRows is true, you must also provide a view for the detailRowViewClass');
				}
			}
			return enabled;
		}.property('hasDetailRows', 'detailRowViewClass'),
		_rows: function(){
			var rows = this.get('rows'),
				rowIdx = 0,
				column = this.get('_columns').objectAt(this.get('_sortIndex')),
				sort;

			if(rows){
				if(!this.get('customSortAction') && column.get('sortable')){
					sort = column.get('sort');
					rows = sort(column, this.get('rows'), this.get('sortAscending'));
				}
				return rows.map(function(row){
					return RowObject.create({
						content: row,
						_rowIndex: rowIdx++
					});
				});
			}else{
				return [];
			}
		}.property('rows.[]', '_sortIndex', 'sortAscending'),
		_rowsWillRefresh: function(){

		}.observesBefore('_rows'),
		_rowsDidRefresh: function(){

		}.observes('_rows'),
		showDetailForRow: function(rowIndex){
			this.get('rows').objectAt(rowIndex).toggleProperty('_rowDetailVisible');
		},
		attachDetailRowClickHandlers: function(){
			var self = this,
				elmId = this.get('elementId'),
				$rowToggles = $('#'+elmId+' .toggle-detail-row');
			$rowToggles.off();
			$rowToggles.on('click', function(){
				var idx = $(this).data('rowindex');
				self.showDetailForRow(idx);
			});
		},
		isLoadingRows: false,
		loadMoreAction: null,
		_loadMoreRows: function(){
			if(this.get('loadMoreAction') && !this.get('isLoadingRows')){
				this.sendAction('loadMoreAction');
			}
		},
		_showLoadingRow: function(){
			return this.get('infiniteScrollEnabled') && this.get('isLoadingRows');
		}.property('isLoadingRows', 'infiniteScrollEnabled'),
		attachInfiniteScrollListener: function(){
			var self = this;
			$(window).scroll(function(){
				if($(window).scrollTop() === $(document).height() - $(window).height()){
					self._loadMoreRows();
				}
			});
		},
		attachEventHandlers: function(){
			if(this.get('_detailRowsEnabled')){
				this.attachDetailRowClickHandlers();
			}
			if(this.get('showTooltips')){
				this.initializeTooltips();
			}
		},
		initializeTooltips: function(){
			var elmId = this.get('elementId');
			$('#' + elmId + ' .table-component-has-tooltip').tooltip();
		},
		didInsertElement: function(){
			var detailsRowsEnabled = this.get('_detailRowsEnabled'),
				tooltipsEnabled = this.get('showTooltips');
			if(detailsRowsEnabled){
				this.attachDetailRowClickHandlers();
			}
			if(this.get('infiniteScrollEnabled')){
				this.attachInfiniteScrollListener();
			}
			if(tooltipsEnabled){
				this.initializeTooltips();
			}

			// attach observer to re-attach attachEventHandlers
			if(detailsRowsEnabled || tooltipsEnabled){
				this.addObserver('rows.[]', this, this.attachEventHandlers);
			}
		},
		actions: {
			sortTable: function(columnIndex){
				if(this.get('customSortAction')){
					// If customSortAction is defined, bubble it up along with the sortPath.
					this.sendAction('customSortAction', columnIndex, this.get('sortAscending'));
				}else{
					// If no customSortAction defined, then perform the default behavior.
					if(this.get('_sortIndex') === columnIndex){
						this.toggleProperty('sortAscending');
					}else{
						this.set('sortAscending', true);
						this.set('sortIndex', columnIndex);
					}
				}
			}
		}
	});

	// A handlebars helper to create table cells...
	Ember.Handlebars.helper('tableComponentCell', function(row, column){
		var getCellContent = column.get('getCellContent') ? column.get('getCellContent') : null,
			cellContent = '',
			cellClass = '';
		if(!getCellContent && !column.get('cellValuePath')){
			Ember.Logger.warn("<WARNING>: All column definitions require either the \'cellValuePath\' property or \'getCellContent\' function to be defined.");
		}
		if(getCellContent){
			cellContent = getCellContent(row);
		}else{
			cellContent = row.get(column.get('cellValuePath'));
		}

		if(column.get('cellClassName')){
			cellClass = column.get('cellClassName');
		}
		return new Ember.Handlebars.SafeString("<td class='"+cellClass+"'>"+cellContent+"</td>");
	});

	// A handlebars helper to manage the sorting icons in table headers...
	Ember.Handlebars.helper('tableComponentSortIcon', function(column, sortIndex, isAscending) {
		var iconClass = 'fa fa-sort';
		if(column.get('_columnIndex') === sortIndex){
			iconClass = isAscending ? 'fa fa-sort-asc' : 'fa fa-sort-desc';
		}
		return new Ember.Handlebars.SafeString("<span class='table-component-sort-icon "+iconClass+"'></span>");
	});

	Ember.TableComponent = TableComponent;
	Ember.Handlebars.helper('table-component', Ember.TableComponent);
}(this));

Ember.TEMPLATES["ember-bootstrap-table-template-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    <div class=\"table-component-no-content-container\">\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "noContentView", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    </div>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("responsive:table-responsive")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n        <table ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table :table-component hoverable:table-hoverable striped:table-striped bordered:table-bordered condensed:table-condensed")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n            ");
  stack1 = helpers['if'].call(depth0, "showHeader", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            <tbody>\n            ");
  stack1 = helpers.each.call(depth0, "row", "in", "_rows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            ");
  stack1 = helpers['if'].call(depth0, "_showLoadingRow", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(30, program30, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </tbody>\n        </table>\n    </div>\n");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                <thead>\n                <tr>\n                    ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </tr>\n                </thead>\n            ");
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        ");
  stack1 = helpers['if'].call(depth0, "useDefaultDetailRowToggle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        \n                            <th class=\"table-component-header\" width=20></th>\n                        ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        <th ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table-component-header col.headerCellClassName"),
    'width': ("col.columnWidth")
  },hashTypes:{'class': "STRING",'width': "ID"},hashContexts:{'class': depth0,'width': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                            ");
  stack1 = helpers['if'].call(depth0, "col.headerCellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        </th>\n                    ");
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.headerCellCustomViewClass", {hash:{
    'config': ("col")
  },hashTypes:{'config': "ID"},hashContexts:{'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                            ");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                ");
  stack1 = helpers['if'].call(depth0, "col.sortable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(14, program14, data),fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            ");
  return buffer;
  }
function program12(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                                    <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortTable", "col._columnIndex", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(" class=\"table-component-header-sortable-btn\">\n                                        <div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table-component-header-name col._hasTooltipText:table-component-has-tooltip"),
    'title': ("col.headerCellInfo")
  },hashTypes:{'class': "STRING",'title': "ID"},hashContexts:{'class': depth0,'title': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" data-toggle=\"tooltip\">\n                                        <span class=\"table-component-header-cell-text\">\n                                            ");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                        </span>\n                                        <span class=\"table-component-header-cell-sort-container\">\n                                            ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentSortIcon || (depth0 && depth0.tableComponentSortIcon),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "col", "_sortIndex", "sortAscending", options) : helperMissing.call(depth0, "tableComponentSortIcon", "col", "_sortIndex", "sortAscending", options))));
  data.buffer.push("\n                                        </span>\n                                        </div>\n                                    </button>\n                                ");
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                    <div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table-component-header-name col._hasTooltipText:table-component-has-tooltip"),
    'title': ("col.headerCellInfo")
  },hashTypes:{'class': "STRING",'title': "ID"},hashContexts:{'class': depth0,'title': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" data-toggle=\"tooltip\">\n                                    <span class=\"table-component-header-cell-text\">\n                                        ");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                    </span>\n                                    </div>\n                                ");
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                <tr>\n                    ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </tr>\n                ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(28, program28, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            ");
  return buffer;
  }
function program17(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        ");
  stack1 = helpers['if'].call(depth0, "useDefaultDetailRowToggle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  return buffer;
  }
function program18(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        \n                            <td class=\"table-component-detail-toggle-cell\">\n                                <button ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'data-rowindex': ("row._rowIndex")
  },hashTypes:{'data-rowindex': "STRING"},hashContexts:{'data-rowindex': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" class='toggle-detail-row'>\n                                    ");
  stack1 = helpers['if'].call(depth0, "row._rowDetailVisible", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(21, program21, data),fn:self.program(19, program19, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                </button>\n                            </td>\n                        ");
  return buffer;
  }
function program19(depth0,data) {
  
  
  data.buffer.push("\n                                        <span class='fa fa-minus fa-sm'></span>\n                                    ");
  }

function program21(depth0,data) {
  
  
  data.buffer.push("\n                                        <span class='fa fa-plus fa-sm'></span>\n                                    ");
  }

function program23(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        ");
  stack1 = helpers['if'].call(depth0, "col.cellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(26, program26, data),fn:self.program(24, program24, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  return buffer;
  }
function program24(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.cellCustomViewClass", {hash:{
    'row': ("row"),
    'config': ("col")
  },hashTypes:{'row': "ID",'config': "ID"},hashContexts:{'row': depth0,'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                        ");
  return buffer;
  }

function program26(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n                            ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentCell || (depth0 && depth0.tableComponentCell),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "row", "col", options) : helperMissing.call(depth0, "tableComponentCell", "row", "col", options))));
  data.buffer.push("\n                        ");
  return buffer;
  }

function program28(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                    <tr ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table-component-detail-row :collapse row._rowDetailVisible:in")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                        <td ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'colspan': ("_rowColspan")
  },hashTypes:{'colspan': "STRING"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                            <div class=\"table-component-detail-container\">\n                                ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "detailRowViewClass", {hash:{
    'row': ("row")
  },hashTypes:{'row': "ID"},hashContexts:{'row': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                            </div>\n                        </td>\n                    </tr>\n                ");
  return buffer;
  }

function program30(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                <tr class='table-component-loading-row'>\n                    <td ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'colspan': ("_rowColspan")
  },hashTypes:{'colspan': "STRING"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                        <div class=\"table-component-loading-container\">\n                            <span class='fa fa-spinner fa-spin fa-2x'></span>\n                        </div>\n                    </td>\n                </tr>\n            ");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "_showNoContentView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});