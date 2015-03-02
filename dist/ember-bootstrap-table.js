(function(){
    //import Em from 'ember';
    var $ = Em.$,
        get = Em.get,
        set = Em.set;

    var DefaultIcons = Em.Object.extend({
        sortable: 'fa fa-sort',
        sortAsc: 'fa fa-sort-asc',
        sortDesc: 'fa fa-sort-desc',
        detailsClosed: 'fa fa-chevron-right',
        detailsOpen: 'fa fa-chevron-down',
        loadingRows: 'fa fa-spinner fa-pulse fa-2x'
    });

    var DefaultToggleCell = Em.View.extend({
        tagName: 'td',
        classNames: ['table-component-row-toggle-cell'],
        rowData: null,
        icons: {},
        toggleIconClass: function(){
            return this.get('rowData._detailRowEnabled') ? this.get('icons.detailsOpen') : this.get('icons.detailsClosed');
        }.property('rowData._detailRowEnabled'),
        template: function(){
            var btnAction = "{{action '_toggledDetailRow' view.rowData._rowIndex view.rowData._detailRowEnabled}}",
                btnClass = "class='table-cell-button'",
                iconBinding = "{{bind-attr class='view.toggleIconClass'}}";
            return Em.Handlebars.compile(
                "<button " + btnAction + " " + btnClass + ">" +
                "<span " + iconBinding + "></span>" +
                "</button>"
            );
        }.property('rowData._detailRowEnabled', 'rowData._rowIndex', 'toggleIconClass')
    });

    var LoadingRow = Em.View.extend({
        tagName: 'tr',
        classNames: ['table-component-loading-row'],
        component: function(){
            return this.get('_parentView._parentView._parentView._parentView');
        }.property('_parentView._parentView._parentView._parentView'),
        template: function(){
            var component = this.get('component'),
                icon = get(component, '_icons.loadingRows'),
                colspan = get(component, '_colspan');
            return Em.Handlebars.compile(
                "<td class='table-component-loading-cell' colspan='"+ colspan +"'>" +
                "{{#if view.component.isLoadingRows}}" +
                    "<span class='table-component-loading-icon "+ icon +"'></span>" +
                "{{/if}}" +
                "</td>"
            );
        }.property('component.isLoadingRows')
    });

    var THeadContainerView = Em.ContainerView.extend({
        tagName: 'thead',
        classNames: ['table-component-thead']
    });

    var TBodyContainerView = Em.ContainerView.extend({
        tagName: 'tbody',
        classNames: ['table-component-tbody']
    });

    var TFootContainerView = Em.ContainerView.extend({
        tagName: 'tfoot',
        classNames: ['table-component-tfoot'],
        childViews: [LoadingRow.create()]
    });

    var TableContainerView = Em.ContainerView.extend({
        tagName: 'table',
        classNames: ['table-component-table', 'table'],
        classNameBindings: ['condensed:table-condensed',
            'striped:table-striped', 'bordered:table-bordered', 'hoverable:table-hoverable'],
        childViews: ['thead', 'tbody', 'tfoot'],
        thead: THeadContainerView.create(),
        tbody: TBodyContainerView.create(),
        tfoot: TFootContainerView.create(),
        showHeader: true,
        hoverable: true,
        striped: false,
        condensed: false,
        bordered: false,
        icons: null,
        colspan: null,
        updateSortableHeaders: function(sortIdx, sortAsc){
            var tr = this.get('thead').objectAt(0);
            if(tr){
                tr.forEach(function(th, idx){
                    th.setProperties({
                        sortSelection: (sortIdx === idx),
                        sortAscending: sortAsc
                    });
                });
            }
        }
    });

    var HeaderRowContainerView = Em.ContainerView.extend({
        tagName: 'tr',
        classNames: ['table-component-header-row']
    });

    var HeaderCellView = Em.View.extend({
        tagName: 'th',
        classNames: ['table-component-header-cell'],
        classNameBindings: ['colConfig.headerCellClassName'],
        attributeBindings: ['width'],
        width: function(){
            return get(this, 'colConfig.columnWidth');
        }.property('colConfig.columnWidth'),
        colConfig: null,
        icons: {},
        sortSelection: false,
        sortAscending: false,
        showTooltips: true,
        sortIconClass: function(){
            if(get(this, 'sortSelection')){
                return get(this, 'sortAscending') ? get(this, 'icons.sortAsc') : get(this, 'icons.sortDesc');
            }else{
                return get(this, 'icons.sortable');
            }
        }.property('sortSelection', 'sortAscending'),
        template: function(){
            var colConfig = this.get('colConfig'),
                headerName = get(colConfig, 'headerCellName'),
                sortable = get(colConfig, 'sortable'),
                headerInfo = get(colConfig, 'headerCellInfo'),
                tooltipAttr = headerInfo ? "title='"+ headerInfo +"' data-toggle='tooltip'" : '',
                contents = headerName,
                btnAction, btnClass,
                textClass, iconBinding;
            if(sortable){
                btnAction = "{{action '_sortTable' view.colConfig._columnIndex}}";
                btnClass = "class='table-cell-button table-component-header-cell-sort'";
                textClass = "class='table-component-header-text'";
                iconBinding = "{{bind-attr class=':table-component-sort-icon view.sortIconClass'}}";
                contents =
                    "<button " + btnAction + " " + btnClass + " " + tooltipAttr + ">" +
                    "<span " + textClass + ">" + headerName + "</span>" +
                    "<span " + iconBinding + "></span>" +
                    "</button>";
            }else{
                contents = "<span class='table-component-header-text'" + tooltipAttr + ">" + headerName + "</span>";
            }
            return Em.Handlebars.compile(contents);
        }.property('colConfig', 'sortSelection', 'sortAscending'),
        didInsertElement: function(){
            if(this.get('showTooltips')){
                this.$().find("[data-toggle='tooltip']").tooltip();
            }
        }
    });

    var RowContainerView = Em.ContainerView.extend({
        tagName: 'tr',
        classNames: ['table-component-row']
    });

    var DetailRowCellView = Em.View.extend({
        tagName: 'td',
        classNames: ['table-component-detail-row-cell'],
        attributeBindings: ['colspan:colspan'],
        detailViewClass: null,
        row: null,
        colspan: null,
        template: Em.Handlebars.compile(
            "<div class='table-component-detail-container'>" +
            "{{view view.detailViewClass row=view.row.content}}" +
            "</div>"
        )
    });

    var DetailRowContainerView = Em.ContainerView.extend({
        tagName: 'tr',
        classNames: ['table-component-detail-row', 'collapse'],
        classNameBindings: ['isEnabled:in'],
        isEnabled: function(){
            return this.get('row._detailRowEnabled');
        }.property('row._detailRowEnabled'),
        row: null
    });

    var CellView = Em.View.extend({
        tagName: 'td',
        classNames: ['table-component-cell'],
        classNameBindings: ['colConfig.cellClassName'],
        attributeBindings: ['width'],
        width: function(){
            return this.get('colConfig.columnWidth');
        }.property('colConfig.columnWidth'),
        colConfig: null,
        row: null,
        template: function(){
            var colConfig = get(this, 'colConfig'),
                getCellContent = get(colConfig, 'getCellContent'),
                cellValuePath = get(colConfig, 'cellValuePath'),
                rowData = get(this, 'row'),
                value = '';
            if(getCellContent){
                // use getCellContent to return the formatted value if it is defined.
                value = getCellContent(rowData, colConfig);
            }else{
                // otherwise, try to use cellValuePath to get the content.
                value = get(rowData, cellValuePath);
            }
            return Em.Handlebars.compile(value.toString());
        }.property('row')
    });

    var DefaultColumnConfig = Em.Object.extend({
        headerCellName: '',
        headerCellClassName: null,
        headerCellCustomViewClass: null,
        headerCellInfo: null,
        cellValuePath: null,
        cellClassName: null,
        cellCustomViewClass: null,
        getCellContent: null,
        columnWidth: null,
        sortAscending: true,
        _columnIndex: null,
        sortOn: null,
        sort: function(column, rows, isAscending){
            rows = rows || [];
            column = column || Em.Object.create();
            var getCellContent = get(column, 'getCellContent'),
                valuePath = get(column, 'cellValuePath'),
                sortOnCellValuePath = get(column, 'sortOn') && (get(column, 'sortOn') === 'cellValuePath');
            // Fix for Ember array not having .sort method.
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
                    var aVal = getCellContent(a, column),
                        bVal = getCellContent(b, column);
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
                    var aVal = get(a, valuePath),
                        bVal = get(b, valuePath);
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

    var RowObject = Em.ObjectProxy.extend({
        _rowIndex: null,
        _detailRowEnabled: false
    });

    var TableComponent = Em.Component.extend({

        // [BEGIN] User-Defined Options:
        sortIndex: 0,
        sortAscending: true,
        rows: [],
        columns: [],
        icons: null,
        hoverable: true,
        striped: false,
        condensed: false,
        responsive: true,
        bordered: false,
        customSortAction: null,
        noContentView: null,
        showHeader: true,
        showTooltips: true,
        useDefaultDetailRowToggle: true,
        customDetailRowToggleAction: null,
        detailRowViewClass: null,
        hasDetailRows: false,
        infiniteScrollEnabled: false,
        isLoadingRows: false,
        loadMoreAction: null,
        // [END] User-Defined Options:

        tagName: 'div',
        classNames: ['table-component'],
        classNameBindings: ['responsive:table-responsive'],
        childViews: ['_table'],
        _table: TableContainerView.create(),
        _isRendering: true,
        layout: Em.Handlebars.compile(
            "{{#if _showNoContentView}}" +
            "{{view noContentView}}" +
            "{{else}}" +
            "{{view _table bordered=bordered condensed=condensed striped=striped hoverable=hoverable " +
            "showHeader=showHeader}}" +
                //"<div class='table-component-rendering-mask'></div>" +
            "{{/if}}"
        ),
        init: function(){
            this._super();
            this._configureIcons();
            if(this.get('showHeader')){
                this._insertHeaderCells();
            }
            this._insertRows();
        },
        _rows: function(){
            var rows = this.get('rows') || [],
                rowIdx = 0;
            if(this.get('_useNativeSort')){
                rows = this._performNativeSort(rows);
            }
            return rows.map(function(row){
                return RowObject.create({
                    content: row,
                    _rowIndex: rowIdx++
                });
            });
        }.property('rows.[]'),
        sortingPropertiesChanged: function(){
            var component = this;
            Em.run.once(function(){
                if(component.get('_useNativeSort')){
                    component.notifyPropertyChange('rows');
                }else{
                    component.sendAction('customSortAction', component.get('sortIndex'), component.get('sortAscending'));
                }
            });
        }.observes('sortAscending', 'sortIndex'),
        _cols: function(){
            var cols = this.get('columns') || [],
                colIdx = 0;
            return cols.map(function(col){
                var config = DefaultColumnConfig.create(col);
                config.set('_columnIndex', colIdx++);
                return config;
            });
        }.property('columns'),
        _rowsChanged: function(){
            var component = this;
            Em.run.once(function(){

                component._removeRows();
                component._insertRows();
            });
        }.observes('_rows.[]'),
        _icons: null,
        _configureIcons: function(){
            var overrides = this.get('icons') || {},
                icons = DefaultIcons.create(overrides);
            this.set('_icons', icons);
            this.set('_table.icons', icons);
            this.set('_table.colspan', this.get('_colspan'));
        },
        _insertHeaderCells: function(){
            var thead = this.get('_table.thead'),
                headerCells = [],
                icons = this.get('_icons'),
                showTooltips = this.get('showTooltips');

            if(this.get('_insertDefaultDetailToggle')){
                // pushing an empty header cell to offset detail-row toggle cells.
                headerCells.push(Em.View.create({tagName: 'th'}));
            }

            this.get('_cols').forEach(function(col){
                var cellView = col.get('headerCellCustomViewClass') || HeaderCellView;
                headerCells.push(cellView.create({
                    colConfig: col,
                    icons: icons,
                    showTooltips: showTooltips
                }));
            });
            thead.pushObject(HeaderRowContainerView.create({
                childViews: headerCells
            }));
            this._updateSortingIcons();
        },
        _updateSortingIcons: function(){
            var idx = this.get('useDefaultDetailRowToggle') ? (this.get('sortIndex') + 1) : this.get('sortIndex');
            this.get('_table').updateSortableHeaders(idx, this.get('sortAscending'));
        },
        _useNativeSort: function(){
            return this.get('customSortAction') === null;
        }.property('customSortAction'),
        _performNativeSort: function(rows){
            var sortAsc = this.get('sortAscending'),
                colConfig = this.get('_cols').objectAt(this.get('sortIndex')),
                sort = get(colConfig, 'sort');
            return sort(colConfig, rows, sortAsc);
        },
        _insertRows: function(){
            var component = this,
                tbody = this.get('_table.tbody'),
                rowViews = [];
            this.get('_rows').forEach(function(row){
                var rowView = RowContainerView.create();
                component._insertCellsForRow(rowView, row);
                rowViews.push(rowView);
                if(component.get('_detailRowsEnabled')){
                    rowViews.push(component._createDetailRow(row));
                }
            });
            tbody.pushObjects(rowViews);
        },
        _normalizeRowObject: function(rowData){
            // Returns just the content from the object proxy...
            return get(rowData, 'content');
        },
        _createDetailRow: function(row){
            var detailCell = DetailRowCellView.create({
                    colspan: this.get('_colspan'),
                    row: row,
                    detailViewClass: this.get('detailRowViewClass')
                }),
                detailRow = DetailRowContainerView.create({
                    row: row
                });
            detailRow.pushObject(detailCell);
            return detailRow;
        },
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
        _removeRows: function(){
            var tbody = this.get('_table.tbody');
            tbody.removeAllChildren();
        },
        _insertDefaultDetailToggle: function(){
            return this.get('_detailRowsEnabled') && this.get('useDefaultDetailRowToggle');
        }.property('_detailRowsEnabled', 'useDefaultDetailRowToggle'),
        _insertCellsForRow: function(rowView, rowData){
            if(this.get('_insertDefaultDetailToggle')){
                rowView.pushObject(DefaultToggleCell.create({
                    rowData: rowData,
                    icons: this.get('_icons')
                }));
            }
            // Converting ObjectProxy's content back into Object before passing it to view.
            var row = this._normalizeRowObject(rowData);
            this.get('_cols').forEach(function(col){
                var viewClass = get(col, 'cellCustomViewClass');
                if(!viewClass){
                    viewClass = CellView;
                }
                var view = viewClass.create({
                    colConfig: col,
                    row: row
                });
                rowView.pushObject(view);
            });
        },
        _showNoContentView: function(){
            return (this.get('noContentView') !== null) && !this.get('_hasRows');
        }.property('_hasNoContentView', 'rows.[]'),
        _hasRows: function(){
            return this.get('rows') && this.get('rows.length') > 0;
        }.property('rows.[]'),
        _numColumns: function(){
            return this.get('columns').length;
        }.property('columns.[]'),
        _colspan: function(){
            if(this.get('_detailRowsEnabled') && this.get('useDefaultDetailRowToggle')){
                // extra column for the detailView toggle
                return this.get('_numColumns') + 1;
            }else{
                return this.get('_numColumns');
            }
        }.property('columns.[]', 'useDefaultDetailRowToggle', '_detailRowsEnabled'),
        _loadMoreRows: function(){
            if(this.get('loadMoreAction') && !this.get('isLoadingRows')){
                this.sendAction('loadMoreAction');
            }
        },
        _showLoadingRow: function(){
            return this.get('infiniteScrollEnabled') && this.get('isLoadingRows');
        }.property('isLoadingRows', 'infiniteScrollEnabled'),
        _attachInfiniteScrollListener: function(){
            var comp = this;
            $(window).scroll(function(){
                if($(window).scrollTop() === $(document).height() - $(window).height()){
                    comp._loadMoreRows();
                }
            });
        },
        didInsertElement: function(){
            if(this.get('infiniteScrollEnabled')){
                this._attachInfiniteScrollListener();
            }
        },


        actions: {
            _sortTable: function(colIdx){
                // If the colIdx is same as current sortIndex, reverse sorting order.
                if(colIdx === this.get('sortIndex')){
                    this.set('sortAscending', !this.get('sortAscending'));
                }else{
                    this.set('sortIndex', colIdx);
                }
                this._updateSortingIcons();
            },
            _toggledDetailRow: function(rowIdx, isOpen){
                // If we are using the default row toggle, toggle the content for that row.
                if(this.get('useDefaultDetailRowToggle')){
                    var row = this.get('_rows').objectAt(rowIdx);
                    set(row, '_detailRowEnabled', !isOpen);
                }
            }
        }
    });

    Em.TableComponent = TableComponent;
    Em.Handlebars.helper('table-component', Em.TableComponent);
}(this));