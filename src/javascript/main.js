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
		layoutName: 'ember-bootstrap-table-template-main',
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