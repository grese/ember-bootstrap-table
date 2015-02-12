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
		sort: function(column, rows, isAscending){
			var getCellContent = column.get('getCellContent'),
				valuePath = column.get('cellValuePath');

			if(!(rows instanceof Em.A) && $.isArray(rows)){
				rows = Em.A(rows);
			}else{
				rows = Em.A([]);
			}

			if(!valuePath && !getCellContent){
				Em.Logger.warn('<Warning:> Table component\'s default sorting function requires that either ' +
				'cellValuePath or getCellContent are specified for each sortable column.  ' +
				'You must either specify one of these params to ' +
				'return the value for this column, or override this column\'s sort function. ', column);
				return rows;
			}
			if(getCellContent){
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
				return rows.sortBy(valuePath);
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