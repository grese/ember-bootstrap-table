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