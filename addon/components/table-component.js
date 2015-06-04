import Em from 'ember';
import layout from '../templates/components/table-component';
import Table from '../views/table-table';
import StickyTable from '../views/table-sticky';
import DefaultIcons from '../models/table-icons';
import NoContent from '../views/table-no-content';
import Column from '../models/table-column';
import RowObject from '../models/table-row';
export default Em.Component.extend({
    // [BEGIN] User-Defined Options:
    rows: [], // array of rows
    columns: [], // array of column configs
    showHeader: true, // whether or not to show thead
    hoverable: true, // bootstrap table-hoverable
    condensed: false, // bootstrap table-condensed
    responsive: false, // bootstrap table-responsive
    bordered: false, // bootstrap table-bordered
    striped: false, // bootstrap table-striped
    infiniteScrollEnabled: false, // whether or not infinite scrolling is enabled.
    isLoadingRows: false, // flag to show/hide loading spinner for infinite scroll.
    loadMoreAction: null, // action that is fired to load more records.
    customSortAction: null, // custom action used for sorting rows (disables native sorting)
    sortAscending: false, // direction to sort in.
    disableSortDirection: false, // disables changing of sortAscending flag.
    stickyHeader: false, // makes headers sticky
    stickyHeaderActive: false, // force header to go sticky.
    stickyHeaderActivatePosition: 100, // scrolling y position when the header should become sticky.
    sortIndex: 0, // the column index that data is currently sorted by.
    icons: null, // custom icons object
    noContentView: NoContent, // view that will be rendered when there are no rows.
    showTooltips: true, // tooltips for column headers or no.
    // [END] User-Defined Options.


    tagName: 'div',
    layout: layout,
    classNames: ['table-component'],
    classNameBindings: ['responsive:table-responsive'],
    _table: null,
    _stickyTable: null,
    init: function(){
        if(this.get('stickyHeader')){
            this.set('_stickyTable', StickyTable.create({
                container: this.container,
                component: this
            }));
        }
        this.set('_table', Table.create({
            container: this.container,
            component: this
        }));
        this._super();
    },
    setupTable: function(){
        if(this.get('_table')){
            this.get('_table').setup();
            this.get('_table').update();
        }
        if(this.get('_stickyTable')){
            this.get('_stickyTable').setup();
        }
    },
    _colspan: Em.computed('_cols.length', function(){
        return this.get('_cols.length');
    }),
    _cols: Em.computed('columns.[]', function(){
        var cols = this.get('columns') || [],
            colIdx = 0;
        return cols.map(function(col){
            var config = Column.create(col);
            config.set('_columnIndex', colIdx++);
            return config;
        });
    }),
    _rows: Em.computed('rows.[]', function(){
        var i = 0;
        return this.get('rows').map(function(row){
            return RowObject.create({
                _rowIndex: i++,
                content: row
            });
        });
    }),
    _rowsChanged: Em.observer('rows.[]', function(){
        this.get('_table').update();
    }),
    _icons: Em.computed('icons', function(){
        var icons = this.get('icons') || {};
        return DefaultIcons.create(icons);
    }),
    _showNoContentView: Em.computed('rows.length', function(){
        return this.get('rows.length') === 0;
    }),
    _handleRowVisibility: function(){
        var visibilityPadding = 100; // provides a little padding to top & bottom of viewport for smooth scrolling.
        var scrollTop = Em.$(window).scrollTop();
        var windowBottom = Em.$(window).height();
        this.get('_table').toggleRowVisibility(scrollTop - visibilityPadding, scrollTop + windowBottom + visibilityPadding);
    },
    _handleInfiniteScroll: function(){
        if(Em.$(window).scrollTop() === Em.$(document).height() - Em.$(window).height()){
            this._loadMoreRows();
        }
    },
    _handleStickyHeader: function(){
        var stickyHeaderPos = this.get('stickyHeaderActivatePosition');
        var $table = this.get('_table').$();
        var pos = Em.$(window).scrollTop();
        var tableBottom = ($table.position().top + $table.outerHeight(true) + 20);
        if(pos <= tableBottom){
            if(pos >= stickyHeaderPos){
                if(!this.get('stickyHeaderActive')){
                    this.set('stickyHeaderActive', true);
                }
            }else{
                if(this.get('stickyHeaderActive')){
                    this.set('stickyHeaderActive', false);
                }
            }
        }else{
            if(this.get('stickyHeaderActive')){
                this.set('stickyHeaderActive', false);
            }
        }
    },
    _handleWindowScroll: function(){
        if(this.get('stickyHeader')){
            this._handleStickyHeader();
        }
        if(this.get('infiniteScrollEnabled')){
            this._handleInfiniteScroll();
        }
        this._handleRowVisibility();
    },
    _loadMoreRows: function(){
        if(this.get('loadMoreAction') && !this.get('isLoadingRows')){
            this.sendAction('loadMoreAction');
        }
    },
    _attachWindowScrollListener: function(){
        Em.$(window).scroll(Em.run.bind(this, this._handleWindowScroll));
    },
    _columnsChanged: Em.observer('_cols.[]', function(){
        if(this.get('_table')){
            this.get('_table').updateColumns();
        }
        if(this.get('_stickyTable')){
            this.get('_stickyTable').updateColumns();
        }
    }),
    willDestroyElement: function(){
        Em.$(window).off('scroll', Em.run.bind(this, this._handleWindowScroll));
    },
    willInsertElement: function(){
        this.setupTable();
    },
    didInsertElement: function(){
        if(this.get('infiniteScrollEnabled') || this.get('stickyHeader')){
            this._attachWindowScrollListener();
        }
    },
    actions: {
        _sort: function(columnIdx){
            // If the colIdx is same as current sortIndex, reverse sorting order.
            if(columnIdx === this.get('sortIndex')){
                // If disableSortDirection is false, we update sortAscending.  If not, do nothing.
                if(!this.get('disableSortDirection')){
                    this.set('sortAscending', !this.get('sortAscending'));
                }
            }else{
                this.set('sortIndex', columnIdx);
            }
        }
    }

});
