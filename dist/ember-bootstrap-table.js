(function(){
    'use strict';

    //import Em from 'ember';
    //var $ = Em.$;
    var get = Em.get;

    var DefaultIcons = Em.Object.extend({
        sortable: '',
        sortAsc: 'fuji-icons caret-up',
        sortDesc: 'fuji-icons caret-down',
        detailsClosed: 'fuji-icons caret-up',
        detailsOpen: 'fuji-icons caret-down'
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
                sortOnCellValuePath = get(column, 'sortOn') && (get(column, 'sortOn') === 'cellValuePath'),
                useGetCellContent = (getCellContent && !sortOnCellValuePath);
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

            return rows.sort(function(a, b){
                var aVal = useGetCellContent ? getCellContent(a, column) : get(a, valuePath),
                    bVal = useGetCellContent ? getCellContent(b, column) : get(b, valuePath);
                if(isAscending){
                    if(aVal < bVal){ return -1; }
                    if(aVal > bVal){ return 1; }
                }else{
                    if(aVal > bVal){ return -1; }
                    if(aVal < bVal){ return 1; }
                }
                return 0;
            });
        },
        _hasTooltipText: function(){
            return this.get('headerCellInfo') ? true : false;
        }.property('headerCellInfo')
    });

    var DefaultToggleCell = Em.View.extend({
        tagName: 'td',
        classNames: ['table-component-row-toggle-cell'],
        rowData: null,
        component: function(){
            return this.get('_parentView.component');
        }.property(),
        toggleIconClass: function(){
            return this.get('rowData._detailRowEnabled') ?
                this.get('component._icons.detailsOpen') : this.get('component._icons.detailsClosed');
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
            return this.get('_parentView.component');
        }.property(),
        template: function(){
            var colspan = this.get('component._colspan');

            return Em.Handlebars.compile(
                "<td class='table-component-loading-cell' colspan='"+ colspan +"'>" +
                "{{#if view.component._showLoadingRow}}" +
                    "<span class='table-component-loading-icon Knight-Rider-loader animate'>" +
                        "<span class='Knight-Rider-bar'></span>" +
                        "<span class='Knight-Rider-bar'></span>" +
                        "<span class='Knight-Rider-bar'></span>" +
                    "</span>" +
                "{{/if}}" +
                "</td>"
            );
        }.property('component.isLoadingRows')
    });

    var HeaderCellView = Em.View.extend({
        tagName: 'th',
        classNames: ['table-component-header-cell'],
        classNameBindings: ['colConfig.headerCellClassName'],
        attributeBindings: ['width'],
        width: function(){
            return get(this, 'colConfig.columnWidth');
        }.property('colConfig.columnWidth'),
        component: function(){
            return this.get('_parentView.component');
        }.property(),
        colConfig: null,
        sortIconClass: function(){
            var currentIdx = this.get('component.sortIndex'),
                thisIdx = this.get('colConfig._columnIndex');
            if(currentIdx === thisIdx){
                return this.get('component.sortAscending') ?
                    this.get('component._icons.sortAsc') : this.get('component._icons.sortDesc');
            }else{
                return this.get('component._icons.sortable');
            }
        }.property('component.sortIndex', 'component.sortAscending'),
        template: function(){
            var colConfig = this.get('colConfig'),
                headerName = colConfig.get('headerCellName'),
                sortable = colConfig.get('sortable'),
                headerInfo = colConfig.get('headerCellInfo'),
                tooltipAttr = headerInfo ? "title='"+ headerInfo +"' data-toggle='tooltip'" : '',
                textClass = "class='table-component-header-text'",
                contents = headerName,
                btnAction, btnClass, iconBinding;
            if(sortable){
                btnAction = "{{action '_sortTable' view.colConfig._columnIndex}}";
                btnClass = "class='table-cell-button table-component-header-cell-sort'";
                iconBinding = "{{bind-attr class=':table-component-sort-icon view.sortIconClass'}}";
                contents =
                    "<button " + btnAction + " " + btnClass + " " + tooltipAttr + ">" +
                    "<span " + textClass + ">" + headerName + "</span>" +
                    "<span class='table-component-sort-icon-container'><span " + iconBinding + "></span></span>" +
                    "</button>";
            }else{
                contents = "<span " + textClass + tooltipAttr + ">" + headerName + "</span>";
            }
            return Em.Handlebars.compile(contents);
        }.property('colConfig', 'component.sortIndex', 'component.sortAscending'),
        didInsertElement: function(){
            if(this.get('component.showTooltips')){
                this.$().find("[data-toggle='tooltip']").tooltip();
            }
        }
    });

    var HeaderRowContainerView = Em.ContainerView.extend({
        tagName: 'tr',
        classNames: ['table-component-header-row'],
        component: function(){
            return this.get('_parentView.component');
        }.property()
    });

    var THeadContainerView = Em.ContainerView.extend({
        tagName: 'thead',
        component: function(){
            return this.get('_parentView.component');
        }.property(),
        insertHeaderCells: function(container){
            var headerCells = [],
                cols = this.get('component._cols');

            if(this.get('component._insertDefaultDetailToggle')){
                // pushing an empty header cell to offset detail-row toggle cells.
                headerCells.push(Em.View.create({tagName: 'th'}));
            }

            cols.forEach(function(col){
                var cellView = col.get('headerCellCustomViewClass') || HeaderCellView;
                headerCells.push(cellView.create({
                    colConfig: col,
                    container: container
                }));
            });

            var headerRow = HeaderRowContainerView.create();
            headerRow.pushObjects(headerCells);
            this.pushObject(headerRow);
        },
        setHeaderCellWidths: function(){
            var row = this.objectAt(0) || Em.Object.create(),
                cells = row.get('childViews') || [],
                widths = this.get('component._table._columnWidths') || [];
            cells.forEach(function(cell, idx){
                var w = widths[idx];
                cell.$().css('width', w);
            });

        },
        updateHeaderCells: function(container){
            this.removeAllChildren();
            this.insertHeaderCells(container);
            var self = this;
            Em.run.later(function(){
                self.setHeaderCellWidths();
            }, 1);
        },
        didInsertElement: function(){
            var self = this;
            Em.run.later(function(){
                self.setHeaderCellWidths();
            }, 1);
        }
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
            var colConfig = this.get('colConfig'),
                getCellContent = colConfig.get('getCellContent'),
                cellValuePath = colConfig.get('cellValuePath'),
                rowData = this.get('rowData'),
                value = '';
            if(getCellContent){
                // use getCellContent to return the formatted value if it is defined.
                value = getCellContent(rowData, colConfig);
            }else{
                // otherwise, try to use cellValuePath to get the content.
                if(cellValuePath){
                    value = (cellValuePath !== null) ? rowData.get(cellValuePath) : '';
                }
            }
            return Em.Handlebars.compile(value.toString());
        }.property()
    });

    var DetailRowCellView = Em.View.extend({
        tagName: 'td',
        classNames: ['table-component-detail-row-cell'],
        attributeBindings: ['colspan'],
        colspan: function(){
            return this.get('component._colspan');
        }.property('component._colspan'),
        component: function(){
            return this.get('_parentView.component');
        }.property(),
        detailViewClass: function(){
            return this.get('component.detailRowViewClass');
        }.property(),
        rowData: null,
        row: function(){
            return this.get('rowData.content');
        }.property('rowData.content'),
        template: Em.Handlebars.compile(
            "<div class='table-component-detail-container'>" +
            "{{view view.detailViewClass row=view.row}}" +
            "</div>"
        )
    });

    var DetailRowContainerView = Em.ContainerView.extend({
        init: function(){
            this._super();
            this.pushObject(DetailRowCellView.create({
                rowData: this.get('rowData')
            }));
        },
        tagName: 'tr',
        classNames: ['table-component-detail-row', 'collapse'],
        classNameBindings: ['isEnabled:in'],
        isEnabled: function(){
            return this.get('rowData._detailRowEnabled');
        }.property('rowData._detailRowEnabled'),
        rowData: null,
        component: function(){
            return this.get('_parentView.component');
        }.property()
    });

    var RowContainerView = Em.ContainerView.extend({
        tagName: 'tr',
        classNames: ['table-component-row'],
        component: function(){
            return this.get('_parentView.component');
        }.property(),
        rowData: null,
        insertCells: function(container){
            var cols = this.get('component._cols'),
                cells = [];

            if(this.get('component._insertDefaultDetailToggle')){
                cells.push(DefaultToggleCell.create({
                    rowData: this.get('rowData')
                }));
            }

            // normalized row (so we don't pass the objectProxy to customViews)
            var row = this.get('rowData.content'),
                rowData = this.get('rowData');
            cols.forEach(function(col){
                var viewClass = col.get('cellCustomViewClass') || CellView;
                var view = viewClass.create({
                    colConfig: col,
                    rowData: rowData,
                    row: row,
                    // Container must be added to fix childViews issue:  http://git.io/EKPpnA
                    container: container
                });
                cells.push(view);
            });
            this.pushObjects(cells);
        }
    });

    var TBodyContainerView = Em.ContainerView.extend({
        tagName: 'tbody',
        component: function(){
            return this.get('_parentView.component');
        }.property(),
        insertRows: function(){
            var self = this,
                rows = this.get('component._rows') || [],
                rowViews = [],
                container = this.get('_parentView.container');

            rows.forEach(function(rowData){
                // Create a row for this item...
                var newRow = RowContainerView.create({
                    rowData: rowData,
                    component: self.get('component')
                });
                newRow.insertCells(container);
                rowViews.push(newRow);
                // If detailRows are enabled, create a detailRow for this item...
                if(self.get('component._detailRowsEnabled')){
                    rowViews.push(DetailRowContainerView.create({
                        rowData: rowData,
                        container: container
                    }));
                }
            });
            // Push new rows into tbody...
            this.pushObjects(rowViews);
        },
        didInsertElement: function(){
            var table = this.get('_parentView');
            // Calculate the column widths for sticky header if 'stickyHeader' enabled.
            if(this.get('component._useStickyHeader')){
                Em.run.later(function(){
                    table.calculateColumnWidths();
                });
            }
        }
    });

    var TFootContainerView = Em.ContainerView.extend({
        init: function(){
            this._super();
            this.set('loadingRow', LoadingRow.create());
            this.pushObject(this.get('loadingRow'));
        },
        tagName: 'tfoot',
        loadingRow: null,
        component: function(){
            return this.get('_parentView.component');
        }.property()
    });

    var StickyHeaderTable = Em.ContainerView.extend({
        init: function(){
            this._super();
            this.set('thead', THeadContainerView.create());
            this.pushObject(this.get('thead'));
        },
        classNames: ['table-component-sticky-header-table', 'table'],
        tagName: 'table',
        component: null,
        isSetup: false,
        setup: function(){
            if(this.get('component._useStickyHeader')){
                this.get('thead').insertHeaderCells(this.container);
            }
            this.set('isSetup', true);
        },
        updateColumns: function(){
            this.get('thead').updateHeaderCells(this.container);
        }
    });

    var TableContainerView = Em.ContainerView.extend({
        init: function(){
            this._super();
            this.set('tbody', TBodyContainerView.create());
            this.set('tfoot', TFootContainerView.create());
            this.set('thead', THeadContainerView.create());
            this.pushObjects([this.get('thead'), this.get('tbody'), this.get('tfoot')]);
        },
        tagName: 'table',
        classNames: ['table-component-table', 'table'],
        component: null,
        classNameBindings: [
            'component.condensed:table-condensed',
            'component.striped:table-striped',
            'component.bordered:table-bordered',
            'component.hoverable:table-hoverable'
        ],
        thead: null,
        tbody: null,
        tfoot: null,
        isSetup: false,
        setup: function(){
            if(this.get('component.showHeader') && !this.get('component.stickyHeader')){
                this.get('thead').insertHeaderCells(this.container);
            }
            this.set('isSetup', true);
        },
        update: function(){
            this.get('tbody').removeAllChildren();
            this.get('tbody').insertRows();
        },
        _columnWidths: [],
        calculateColumnWidths: function(){
            var self = this,
                firstRow = this.get('tbody').objectAt(0),
                cells;
            if(firstRow){
                cells = firstRow.get('childViews');
                cells.forEach(function(cell, idx){
                    var $cell = cell.$();
                    if($cell){
                        self.get('_columnWidths')[idx] = $cell.outerWidth();
                    }
                });
            }
        },
        updateColumns: function(){
            this.update();
            this.calculateColumnWidths();
        }
    });

    var RowObject = Em.ObjectProxy.extend({
        _rowIndex: null,
        _detailRowEnabled: false
    });

    var TableComponent = Em.Component.extend({
        init: function(){
            if(this.get('_useStickyHeader')){
                this.set('_headerTable', StickyHeaderTable.create({
                    component: this,
                    container: this.container
                }));
            }
            this.set('_table', TableContainerView.create({
                component: this,
                container: this.container
            }));
            this._super();
        },

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
        disableSortDirection: false,
        stickyHeader: false,
        stickyHeaderActive: false, // flag to add/remove the 'stickyness' of the header.
        stickyHeaderActivatePosition: 90, // # of pixels from top when sticky header becomes active.
        // [END] User-Defined Options:


        tagName: 'div',
        classNames: ['table-component'],
        _table: null,
        _headerTable: null,
        layout: function(){
            var theadHBS = "",
                tableHBS = "{{view _table}}";
            if(this.get('_useStickyHeader')){
                theadHBS = "<div {{bind-attr class=':table-component-sticky-header-container stickyHeaderActive:sticky'}}>" +
                "<div class='table-component-sticky-header-inner container row'>{{view _headerTable}}</div>" +
                "</div>";
            }
            var noContent = "";
            if(this.get('noContentView') != null){
                noContent = "<div {{bind-attr class=':table-component-no-content-container _showNoContentView::hidden'}}>" +
                "{{view noContentView}}" +
                "</div>";
            }
            return Em.Handlebars.compile(
                noContent +
                "<div {{bind-attr class=':table-component-table-container _showNoContentView:hidden'}}>" +
                theadHBS +
                "<div {{bind-attr class='responsive:table-responsive'}}>" +
                tableHBS +
                "</div>" +
                "</div>"
            );
        }.property('_showNoContentView'),
        _cols: function(){
            var cols = this.get('columns') || [],
                colIdx = 0;
            return cols.map(function(col){
                var config = DefaultColumnConfig.create(col);
                config.set('_columnIndex', colIdx++);
                return config;
            });
        }.property('columns.[]'),
        _rows: function(){
            var rows = this.get('rows') || [],
                rowIdx = 0;
            if(this.get('_useNativeSort') && this.get('_hasRows')){
                rows = this._performNativeSort(rows);
            }
            return rows.map(function(row){
                return RowObject.create({
                    content: row,
                    _rowIndex: rowIdx++
                });
            });
        }.property('rows.[]'),
        _rowsChanged: function(){
            var component = this;
            Em.run.once(function(){
                component.get('_table').update();
            });
        }.observes('_rows.[]'),
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
        _useNativeSort: function(){
            return this.get('customSortAction') === null;
        }.property('customSortAction'),
        _performNativeSort: function(rows){
            var sortAsc = this.get('sortAscending'),
                colConfig = this.get('_cols').objectAt(this.get('sortIndex')),
                sort;
            if(colConfig.get('sortable')){
                sort = get(colConfig, 'sort');
                return sort(colConfig, rows, sortAsc);
            }else{
                return rows;
            }
        },
        _sortingPropertiesChanged: function(){
            var component = this;
            Em.run.once(function(){
                if(component.get('_useNativeSort')){
                    component.notifyPropertyChange('rows');
                }else{
                    component.sendAction('customSortAction', component.get('sortIndex'), component.get('sortAscending'));
                }
            });
        }.observes('sortAscending', 'sortIndex'),
        _showNoContentView: function(){
            return (this.get('noContentView') !== null) && !this.get('_hasRows');
        }.property('_hasNoContentView', 'rows.[]'),
        _icons: function(){
            var overrides = this.get('icons') || {};
            return DefaultIcons.create(overrides);
        }.property('icons'),
        _hasRows: function(){
            return this.get('rows') && this.get('rows.length') > 0;
        }.property('rows.[]'),
        _hasColumns: function(){
            return this.get('columns') && this.get('columns.length') > 0;
        }.property('columns.[]'),
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
        _useStickyHeader: function(){
            return this.get('showHeader') && this.get('stickyHeader');
        }.property('showHeader', 'stickyHeader'),
        _insertDefaultDetailToggle: function(){
            return this.get('_detailRowsEnabled') && this.get('useDefaultDetailRowToggle');
        }.property(),
        _sortIndex: function(){
            if(this.get('_insertDefaultDetailToggle')){
                return this.get('sortIndex') + 1;
            }else{
                return this.get('sortIndex');
            }
        }.property('sortIndex'),
        _attachInfiniteScrollListener: function(){
            var comp = this;
            $(window).scroll(function(){
                if($(window).scrollTop() === $(document).height() - $(window).height()){
                    comp._loadMoreRows();
                }
            });
        },
        _attachStickyHeaderListener: function(){
            var comp = this;
            var stickyHeaderPos = this.get('stickyHeaderActivatePosition');
            var $table = this.get('_table').$();
            $(window).scroll(function(){
                var pos = $(window).scrollTop();
                var tableBottom = ($table.position().top + $table.outerHeight(true) + 20);
                if(pos <= tableBottom){
                    if(pos >= stickyHeaderPos){
                        if(!comp.get('stickyHeaderActive')){
                            comp.set('stickyHeaderActive', true);
                        }
                    }else if(pos < stickyHeaderPos){
                        if(comp.get('stickyHeaderActive')){
                            comp.set('stickyHeaderActive', false);
                        }
                    }
                }else{
                    // The user has scrolled past the bottom of the table, so headers shouldn't be sticky anymore.
                    if(comp.get('stickyHeaderActive')){
                        comp.set('stickyHeaderActive', false);
                    }
                }
            });
        },
        _showNoContentViewChanged: function(){
            var component = this;
            Em.run.once(function(){
                component.setupTable();
                component.get('_table').update();
            });
        }.observes('_showNoContentView'),
        _columnsChanged: function(){
            this.get('_table').updateColumns();
            if(this.get('_headerTable')){
                this.get('_headerTable').updateColumns();
            }
        }.observes('_cols.[]'),
        setupTable: function(){
            // call setup on table prior to inserting element into DOM:
            if(this.get('_headerTable') && !this.get('_headerTable.isSetup')){
                this.get('_headerTable').setup();
            }
            if(!this.get('_table.isSetup')){
                this.get('_table').setup();
            }
        },
        willInsertElement: function(){
            if(!this.get('_showNoContentView')){
                this.setupTable();
                this.get('_table').update();
            }
        },
        didInsertElement: function(){
            if(this.get('infiniteScrollEnabled')){
                this._attachInfiniteScrollListener();
            }
            if(this.get('_useStickyHeader')){
                this._attachStickyHeaderListener();
            }
        },

        actions: {
            _sortTable: function(colIdx){
                // If the colIdx is same as current sortIndex, reverse sorting order.
                if(colIdx === this.get('sortIndex')){
                    // If disableSortDirection is false, we update sortAscending.  If not, do nothing.
                    if(!this.get('disableSortDirection')){
                        this.set('sortAscending', !this.get('sortAscending'));
                    }
                }else{
                    this.set('sortIndex', colIdx);
                }
            },
            _toggledDetailRow: function(rowIdx, isOpen){
                // If we are using the default row toggle, toggle the content for that row.
                if(this.get('useDefaultDetailRowToggle')){
                    var row = this.get('_rows').objectAt(rowIdx);
                    row.set('_detailRowEnabled', !isOpen);
                }
            }
        }
    });


    Em.TableComponent = TableComponent;
    Em.Handlebars.helper('table-component', Em.TableComponent);

}(this));
