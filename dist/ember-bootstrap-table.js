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
		layoutName: 'table-component-template-main',
		showHeader: true,
		hoverable: true,
    	striped: false,
    	condensed: false,
    	responsive: true,
    	bordered: false,
    	customSortAction: null,
    	sortProperty: null,
    	sortAscending: true,
    	_sortProperty: function(){
	        if(!this.get('sortProperty')){
	            return this.get('defaultSortProperty');
	        }else{
	            return this.get('sortProperty');
	        }
    	}.property('sortProperty'),
    	_columns: function(){
	        return this.get('columns').map(function(column){
	            return DefaultColumnConfig.create(column);
	        });
    	}.property('columns.[]'),
    	_rows: function(){
        	return this.get('rows');
    	}.property('rows.[]', 'columns.[]', 'sortProperty', 'sortAscending'),
    	actions: {
	        sortTable: function(sortPath){
	        	if(this.get('customSortAction')){
	        		// If customSortAction is defined, bubble it up along with the sortPath.
	        		this.sendAction(this.get('customSortAction'), sortPath);
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

Ember.TEMPLATES["table-component-template-main"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <thead>\n            <tr>\n                ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </tr>\n            </thead>\n        ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    <th class=\"table-component-header\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'width': ("col.columnWidth")
  },hashTypes:{'width': "ID"},hashContexts:{'width': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n                        ");
  stack1 = helpers['if'].call(depth0, "col.headerCellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                    </th>\n                ");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                            ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.headerCellCustomViewClass", {hash:{
    'config': ("col")
  },hashTypes:{'config': "ID"},hashContexts:{'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                        ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                            ");
  stack1 = helpers['if'].call(depth0, "col.sortable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                        ");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n                                <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortTable", "col.cellValuePath", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(" class=\"table-component-header-sortable-btn\">\n                                    <div class=\"table-component-header-name\">\n                                        <span>\n                                            ");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                            &nbsp;\n                                            ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentSortIcon || (depth0 && depth0.tableComponentSortIcon),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "col", "sortProperty", "sortAscending", options) : helperMissing.call(depth0, "tableComponentSortIcon", "col", "sortProperty", "sortAscending", options))));
  data.buffer.push("\n                                        </span>\n                                    </div>\n                                    <div class=\"table-component-header-info\">");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellInfo", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                                </button>\n                            ");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                                <div class=\"table-component-header-name\">");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                                <div class=\"table-component-header-info\">");
  stack1 = helpers._triageMustache.call(depth0, "col.headerCellInfo", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</div>\n                            ");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n            <tr>\n                ");
  stack1 = helpers.each.call(depth0, "col", "in", "_columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n            </tr>\n        ");
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n                    ");
  stack1 = helpers['if'].call(depth0, "col.cellCustomViewClass", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(14, program14, data),fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                ");
  return buffer;
  }
function program12(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "col.cellCustomViewClass", {hash:{
    'row': ("row"),
    'config': ("col")
  },hashTypes:{'row': "ID",'config': "ID"},hashContexts:{'row': depth0,'config': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n                    ");
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n                        ");
  data.buffer.push(escapeExpression((helper = helpers.tableComponentCell || (depth0 && depth0.tableComponentCell),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "row", "col", options) : helperMissing.call(depth0, "tableComponentCell", "row", "col", options))));
  data.buffer.push("\n                    ");
  return buffer;
  }

  data.buffer.push("<div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("responsive:table-responsive")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n    <table ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":table :table-component hoverable:table-hoverable striped:table-striped bordered:table-bordered condensed:table-condensed")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n        ");
  stack1 = helpers['if'].call(depth0, "showHeader", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        <tbody>\n        ");
  stack1 = helpers.each.call(depth0, "row", "in", "_rows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </tbody>\n    </table>\n</div>");
  return buffer;
  
});