(function(){
	'use strict';

	// The default configuration for a column object:
	var DefaultColumnConfig = Ember.Object.extend({
		headerCellName: '',
		headerCellCustomViewClass: null,
		cellValuePath: null,
		cellCustomViewClass: null,
		getCellContent: null,
		columnWidth: null
	});

	var RowObject = Ember.ObjectProxy.extend({
		_rowDetailVisible: false,
		_rowIndex: null
	});

	// The component :)
	var TableComponent = Ember.Component.extend({
		init: function(){
			if(!this.get('defaultSortProperty')){
				// If no defaultSortProperty set, find the first sortable column and set that as default.
				var defaultProp = '';
				$.each(this.get('_columns'), function(idx, itm){
					if(itm.get('sortable')){
						defaultProp = itm.get('cellValuePath');
						return false;
					}
				});
				this.set('defaultSortProperty', defaultProp);
			}
			this._super();
		},
		headersFixed: false,
		layoutName: 'ember-bootstrap-table-template-main',
		detailRowViewClass: null,
		hasDetailRows: false,
		useDefaultDetailRowToggle: true,
		showHeader: true,
		hoverable: true,
		striped: false,
		condensed: false,
		responsive: true,
		bordered: false,
		customSortAction: null,
		sortProperty: null,
		sortAscending: true,
		infiniteScrollEnabled: false,
		_sortProperty: function(){
			return this.get('sortProperty') ? this.get('sortProperty') : this.get('defaultSortProperty');
		}.property('sortProperty'),
		_columns: function(){
			if(this.get('columns')){
				return this.get('columns').map(function(column){
					return DefaultColumnConfig.create(column);
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
				rowIdx = 0;
			if(rows){
				return rows.map(function(row){
					return RowObject.create({
						content: row,
						_rowIndex: rowIdx++
					});
				});
			}else{
				return [];
			}
		}.property('rows.[]', 'sortProperty', 'sortAscending'),
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
		_headersFixed: function(){
			return this.get('headersFixed') && this.get('showHeader');
		}.property('headersFixed', 'showHeader'),
		_headersInline: function(){
			return !this.get('headersFixed') && this.get('showHeader');
		}.property('headersFixed', 'showHeader'),
		didInsertElement: function(){
			if(this.get('_detailRowsEnabled')){
				this.attachDetailRowClickHandlers();
				this.addObserver('rows.[]', this, this.attachDetailRowClickHandlers);
			}
			if(this.get('infiniteScrollEnabled')){
				this.attachInfiniteScrollListener();
			}
		},
		actions: {
			sortTable: function(sortPath){
				if(this.get('customSortAction')){
					// If customSortAction is defined, bubble it up along with the sortPath.
					this.sendAction('customSortAction', sortPath);
				}else{
					// If no customSortAction defined, then perform the default behavior.
					if(this.get('getSortProperty') === sortPath){
						this.toggleProperty('sortAscending');
					}else{
						this.set('sortAscending', true);
						this.set('sortProperty', sortPath);
					}
				}
			}
		}
	});

	// A handlebars helper to create table cells...
	Ember.Handlebars.helper('tableComponentCell', function(row, column){
		var getCellContent = column.get('getCellContent') ? column.get('getCellContent') : null,
			cellContent = '';
		if(!getCellContent && !column.get('cellValuePath')){
			Ember.Logger.warn("<WARNING>: All column definitions require either the \'cellValuePath\' property or \'getCellContent\' function to be defined.");
		}
		if(getCellContent){
			cellContent = getCellContent(row);
		}else{
			cellContent = row.get(column.get('cellValuePath'));
		}
		return new Ember.Handlebars.SafeString("<td>"+cellContent+"</td>");
	});

	// A handlebars helper to manage the sorting icons in table headers...
	Ember.Handlebars.helper('tableComponentSortIcon', function(column, sortProperty, isAscending) {
		var iconClass = 'fa fa-sort';
		if(column.get('cellValuePath') === sortProperty && isAscending){
			iconClass = 'fa fa-sort-asc';
		}else if(column.get('cellValuePath') === sortProperty && !isAscending){
			iconClass = 'fa fa-sort-desc';
		}
		return new Ember.Handlebars.SafeString("<i class='"+iconClass+"'></i>");
	});

	Ember.TableComponent = TableComponent;
	Ember.Handlebars.helper('table-component', Ember.TableComponent);
}(this));

Ember.TEMPLATES["ember-bootstrap-table-template-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <div class='table-component-header-fixed-container'>\n        <table class='table-component-header-fixed table table-component'>\n        <thead>\n        <tr>\n            ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </tr>\n        </thead>\n        </table>\n    </div>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                ");
  stack1 = helpers['if'].call(depth0, "useDefaultDetailRowToggle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                    \n                    <th class=\"table-component-header\" width=20></th>\n                ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                <th class=\"table-component-header\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'width': ("col.columnWidth")
  },hashTypes:{'width': "ID"},hashContexts:{'width': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                    ");
  stack1 = helpers['if'].call(depth0, "col.headerCellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                </th>\n            ");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.headerCellCustomViewClass", {hash:{
    'config': ("col")
  },hashTypes:{'config': "ID"},hashContexts:{'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        ");
  stack1 = helpers['if'].call(depth0, "col.sortable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    ");
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                            <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortTable", "col.cellValuePath", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(" class=\"table-component-header-sortable-btn\">\n                                <div class=\"table-component-header-name\">\n                                    <span>\n                                        ");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                        &nbsp;\n                                        ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentSortIcon || (depth0 && depth0.tableComponentSortIcon),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "col", "_sortProperty", "sortAscending", options) : helperMissing.call(depth0, "tableComponentSortIcon", "col", "_sortProperty", "sortAscending", options))));
  data.buffer.push("\n                                    </span>\n                                </div>\n                            </button>\n                        ");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                            <div class=\"table-component-header-name\">");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                        ");
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <thead ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("_headersFixed:table-component-header-fixed")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n            <tr>\n                ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </tr>\n            </thead>\n        ");
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    ");
  stack1 = helpers['if'].call(depth0, "useDefaultDetailRowToggle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program15(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        \n                        <th class=\"table-component-header\" width=20></th>\n                    ");
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    <th class=\"table-component-header\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'width': ("col.columnWidth")
  },hashTypes:{'width': "ID"},hashContexts:{'width': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                        ");
  stack1 = helpers['if'].call(depth0, "col.headerCellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(20, program20, data),fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </th>\n                ");
  return buffer;
  }
function program18(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.headerCellCustomViewClass", {hash:{
    'config': ("col")
  },hashTypes:{'config': "ID"},hashContexts:{'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                        ");
  return buffer;
  }

function program20(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                            ");
  stack1 = helpers['if'].call(depth0, "col.sortable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(23, program23, data),fn:self.program(21, program21, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  return buffer;
  }
function program21(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                                <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortTable", "col.cellValuePath", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(" class=\"table-component-header-sortable-btn\">\n                                    <div class=\"table-component-header-name\">\n                                        <span>\n                                            ");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                            &nbsp;\n                                            ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentSortIcon || (depth0 && depth0.tableComponentSortIcon),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "col", "_sortProperty", "sortAscending", options) : helperMissing.call(depth0, "tableComponentSortIcon", "col", "_sortProperty", "sortAscending", options))));
  data.buffer.push("\n                                        </span>\n                                    </div>\n                                </button>\n                            ");
  return buffer;
  }

function program23(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                <div class=\"table-component-header-name\">");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                            ");
  return buffer;
  }

function program25(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <tr>\n                ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(26, program26, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(32, program32, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </tr>\n            ");
  stack1 = helpers['if'].call(depth0, "_detailRowsEnabled", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(37, program37, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  return buffer;
  }
function program26(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    ");
  stack1 = helpers['if'].call(depth0, "useDefaultDetailRowToggle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program27(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                        \n                        <td>\n                            <button ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'data-rowindex': ("row._rowIndex")
  },hashTypes:{'data-rowindex': "STRING"},hashContexts:{'data-rowindex': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" class='toggle-detail-row'>\n                                ");
  stack1 = helpers['if'].call(depth0, "row._rowDetailVisible", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(30, program30, data),fn:self.program(28, program28, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                            </button>\n                        </td>\n                    ");
  return buffer;
  }
function program28(depth0,data) {
  
  
  data.buffer.push("\n                                    <span class='fa fa-minus fa-sm'></span>\n                                ");
  }

function program30(depth0,data) {
  
  
  data.buffer.push("\n                                    <span class='fa fa-plus fa-sm'></span>\n                                ");
  }

function program32(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    ");
  stack1 = helpers['if'].call(depth0, "col.cellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(35, program35, data),fn:self.program(33, program33, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program33(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.cellCustomViewClass", {hash:{
    'row': ("row"),
    'config': ("col")
  },hashTypes:{'row': "ID",'config': "ID"},hashContexts:{'row': depth0,'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  return buffer;
  }

function program35(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentCell || (depth0 && depth0.tableComponentCell),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "row", "col", options) : helperMissing.call(depth0, "tableComponentCell", "row", "col", options))));
  data.buffer.push("\n                    ");
  return buffer;
  }

function program37(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                <tr ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table-component-detail-row :collapse row._rowDetailVisible:in")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                    <td ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'colspan': ("_rowColspan")
  },hashTypes:{'colspan': "STRING"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                        <div class=\"table-component-detail-container\">\n                            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "detailRowViewClass", {hash:{
    'row': ("row")
  },hashTypes:{'row': "ID"},hashContexts:{'row': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                        </div>\n                    </td>\n                </tr>\n            ");
  return buffer;
  }

function program39(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n            <tr class='table-component-loading-row'>\n                <td ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'colspan': ("_rowColspan")
  },hashTypes:{'colspan': "STRING"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                    <div class=\"table-component-loading-container\">\n                        <span class='fa fa-spinner fa-spin fa-2x'></span>\n                    </div>\n                </td>\n            </tr>\n        ");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "_headersFixed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n<div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("responsive:table-responsive")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n    <table ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table :table-component hoverable:table-hoverable striped:table-striped bordered:table-bordered condensed:table-condensed")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n        ");
  stack1 = helpers['if'].call(depth0, "_headersInline", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        <tbody>\n        ");
  stack1 = helpers.each.call(depth0, "row", "in", "_rows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = helpers['if'].call(depth0, "_showLoadingRow", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(39, program39, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </tbody>\n    </table>\n</div>");
  return buffer;
  
});