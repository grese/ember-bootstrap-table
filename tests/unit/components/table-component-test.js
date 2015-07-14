import { expect } from 'chai';
import { beforeEach, afterEach } from 'mocha';
import { describeComponent, it } from 'ember-mocha';
import Em from 'ember';

// hack to mock bootstrap tooltip function:
window.$.fn.tooltip = function(){};

describeComponent('table-component', 'Table Component', {
    unit: true
}, function(){
    var mockRows, mockColumns, tooltipSpy;
    var MockNoContentView = Em.View.extend({
        classNames: ['mock-no-content-view']
    });

    beforeEach(function(){
        mockRows = [
            Em.Object.create({id: 1, value: '100', date: '2015-05-01'}),
            Em.Object.create({id: 2, value: '150', date: '2015-05-02'}),
            Em.Object.create({id: 3, value: '300', date: '2015-05-03'})
        ];
        mockColumns = [
            Em.Object.create({
                headerCellName: 'ID',
                headerCellClassName: 'header-cell',
                headerCellInfo: 'the item id',
                cellValuePath: 'id',
                cellClassName: 'id-cell',
                columnWidth: '100px'
            }),
            Em.Object.create({
                headerCellName: 'VALUE',
                headerCellClassName: 'header-cell',
                headerCellInfo: 'the item value',
                cellClassName: 'value-cell',
                cellValuePath: 'value',
                columnWidth: '200px'
            }),
            Em.Object.create({
                headerCellName: 'DATE',
                headerCellClassName: 'header-cell',
                headerCellInfo: 'the item date',
                cellClassName: 'date-cell',
                getCellContent: function(row){
                    return row.get('date');
                },
                columnWidth: '150px'
            })
        ];
        tooltipSpy = sinon.spy($.fn, 'tooltip');
    });


    afterEach(function(){
        tooltipSpy.restore();
    });

    it('should render a div, table, thead, tbody, and tfoot', function() {
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows
        });
        this.render();
        var $component = component.$();
        var tag = $component.prop('tagName');
        expect(tag).to.eq('DIV');

        var $table = $component.find('.table-component-table'),
            $thead = $table.find('.table-component-thead'),
            $tbody = $table.find('.table-component-tbody'),
            $tfoot = $table.find('.table-component-tfoot');
        expect($table.length).to.eq(1);
        expect($thead.length).to.eq(1);
        expect($tbody.length).to.eq(1);
        expect($tfoot.length).to.eq(1);
    });

    it('should render sortable headers with a sort button, and that button should fire the sort action when clicked.', function(){
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
        expect($cell0Sort.length).to.eq(1);
        expect($cell1Sort.length).to.eq(1);
        expect($cell2Sort.length).to.eq(0);

        // should update sortIndex when a new column is clicked.
        Em.run(function(){
            $cell0Sort.click();
        });
        expect(component.get('sortIndex')).to.eq(0);
        expect($cell0Icon.hasClass(component.get('_icons.sortDesc'))).to.be.ok;


        // should update sortAscending when same column is clicked.
        Em.run(function(){
            $cell0Sort.click();
        });
        expect(component.get('sortAscending')).to.be.ok;
        expect($cell0Icon.hasClass(component.get('_icons.sortAsc'))).to.be.ok;

        Em.run(function(){
            $cell1Sort.click();
        });
        expect(component.get('sortIndex')).to.eq(1);
        expect($cell0Icon.hasClass(component.get('_icons.sortAsc'))).not.to.be.ok;
        expect($cell0Icon.hasClass(component.get('_icons.sortDesc'))).not.to.be.ok;
        expect($cell1Icon.hasClass(component.get('_icons.sortAsc'))).to.be.ok;
    });

    it('should render a table with the correct number of columns (stickyHeader = false)', function() {
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows
        });
        this.render();
        var $component = component.$();
        var $headerCells = $component.find('.table-component-table .table-component-thead .table-component-header-cell');
        expect($headerCells.length).to.eq(mockColumns.length);
        mockColumns.forEach(function(col, idx){
            var $cell = Em.$($headerCells[idx]);
            expect($cell.css('width')).to.eq(col.get('columnWidth'));
        });
    });

    it('should render a table and a sticky header table with correct number of columns (stickyHeader = true)', function(){
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows,
            stickyHeader: true
        });
        this.render();
        var $component = component.$();
        var $stickyHeaderCells = $component.find('.table-component-sticky-header-table .table-component-thead .table-component-header-cell');
        var $headerCells = $component.find('.table-component-table .table-component-thead .table-component-header-cell');
        expect($headerCells.length).to.eq(0);
        expect($stickyHeaderCells.length).to.eq(mockColumns.length);
        mockColumns.forEach(function(col, idx){
            var $cell = Em.$($stickyHeaderCells[idx]);
            expect($cell.css('width')).to.eq(col.get('columnWidth'));
        });
    });

    it('should render the header cells with a custom view in the cell if headerCellCustomViewClass is present.', function(){
        var mockView = Em.View.extend({
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
        expect($headerCells.length).to.eq(mockColumns.length);

        var $firstCell = Em.$($headerCells[0]),
            $customView = $firstCell.find('.custom-header-cell');
        expect($customView.length).to.eq(1);
    });

    it('should render a noContentView, and hides the table when there are no rows, and should do the reverse when there ' +
        'are rows.', function() {
        // NoContentView shown, and table hidden when there are no rows:
        var component = this.subject({
            rows: [],
            noContentView: MockNoContentView
        });
        this.render();
        var $component = component.$();
        var $ncv = $component.find('.table-no-content-container .mock-no-content-view');
        var $tableContainer = $component.find('.table-component-table-container');
        expect($ncv.length).to.eq(1);
        expect($tableContainer.hasClass('hidden')).to.be.ok;

        // NoContentView removed when rows exist, and table visible.
        Em.run(function(){
            component.set('rows', mockRows);
        });
        $component = component.$();
        $ncv = $component.find('.table-no-content-container.hidden .mock-no-content-view');
        $tableContainer = $component.find('.table-component-table-container');
        expect($ncv.length).to.eq(1);
        expect($tableContainer.hasClass('hidden')).not.to.be.ok;
    });

    it('should render a row for each object in the rows array, and each row should have the correct cell content & configuration', function(){
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows
        });
        this.render();

        var $component = component.$();
        var $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
        expect($rows.length).to.eq(mockRows.length);

        mockRows.forEach(function(mockRow, idx){
            var $row = Em.$($rows[idx]);
            var $cells = $row.find('.table-component-td'),
                $idCell = $cells.eq(0),
                $valueCell = $cells.eq(1),
                $dateCell = $cells.eq(2);

            var id = Em.$.trim($idCell.text()),
                value = Em.$.trim($valueCell.text()),
                date = Em.$.trim($dateCell.text());

            expect($idCell.hasClass('id-cell')).to.be.ok;
            expect($valueCell.hasClass('value-cell')).to.be.ok;
            expect($dateCell.hasClass('date-cell')).to.be.ok;

            expect(id).to.eq(mockRow.get('id').toString());
            expect(value).to.eq(mockRow.get('value').toString());
            expect(date).to.eq(mockRow.get('date').toString());
        });
    });

    it('should render columns with custom view inside cell if the column has cellCustomViewClass.', function(){
        var mockView = Em.View.extend({
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
        expect($rows.length).to.eq(mockRows.length);

        var $row = Em.$($rows[0]);
        var $cells = $row.find('.table-component-td'),
            $cell = $cells.eq(0),
            $customView = $cell.find('.table-custom-cell-view');

        expect($customView.length).to.eq(1);
    });

    it('should render a loading row, and loading cell in the table footer infiniteScrollEnabled is true', function(){
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows,
            infiniteScrollEnabled: true,
            isLoadingRows: true
        });
        this.render();

        var $component = component.$();
        var $loadingCell = $component.find('.table-component-table .table-component-tfoot .table-component-loading-row .table-component-td');
        expect($loadingCell.length).to.eq(1);

        var $loadingIcon = $loadingCell.find('.table-component-loading-icon');
        expect($loadingIcon.length).to.eq(1);
    });

    it('should re-render the thead and tbody when the columns change', function(){
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows
        });
        this.render();

        var newCols = mockColumns.slice(0, 1);
        Em.run(function(){
            component.set('columns', newCols);
        });
        var $component = component.$();
        var $headers = $component.find('.table-component-table .table-component-thead .table-component-th');
        var $row0Cells = $component.find('.table-component-table .table-component-tbody .table-component-tr').eq(0).find('.table-component-td');
        expect($headers.length).to.eq(1);
        expect($row0Cells.length).to.eq(1);
    });

    it('should re-render the sticky-header table, and the table tbody when columns change and stickyHeader is true.', function(){
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows,
            stickyHeader: true
        });
        this.render();

        var newCols = mockColumns.slice(0, 1);
        Em.run(function(){
            component.set('columns', newCols);
        });
        var $component = component.$();
        var $headers = $component.find('.table-component-sticky-header-container .table-component-sticky-header-table .table-component-thead .table-component-th');
        var $row0Cells = $component.find('.table-component-table .table-component-tbody .table-component-tr').eq(0).find('.table-component-td');
        expect($headers.length).to.eq(1);
        expect($row0Cells.length).to.eq(1);
    });

    it('#_loadMoreRows should send the loadMoreAction if it exists, and isLoadingRows is false', function(){
        var component = this.subject({
            loadMoreAction: 'loadMoreAction',
            isLoadingRows: false
        });
        var spy = sinon.spy(component, 'sendAction');
        component._loadMoreRows();
        expect(spy.calledWith('loadMoreAction')).to.be.ok;
    });

    it('table should re-render when rows array changes', function(){
        var component = this.subject({
            columns: mockColumns,
            rows: mockRows
        });
        this.render();

        var $component = component.$();
        var $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
        expect($rows.length).to.eq(mockRows.length);

        Em.run(function(){
            mockRows.push(Em.Object.create({id: 4, value: '500', date: '2015-05-06'}));
            mockRows.push(Em.Object.create({id: 5, value: '750', date: '2015-05-08'}));
            component.set('rows', mockRows);
            component.notifyPropertyChange('rows');
        });
        $rows = $component.find('.table-component-table .table-component-tbody .table-component-tr');
        expect($rows.length).to.eq(mockRows.length);
    });

    it('should initialize tooltip for each header cell if showTooltips is true, and the columns have headerCellInfo', function(){
        this.subject({
            columns: mockColumns,
            rows: mockRows,
            showTooltips: true
        });
        this.render();
        expect(tooltipSpy.callCount).to.eq(mockColumns.length);
    });

    it('#_retainScrollPosition should scroll the user back to their original scrolling position', function(done){
        var component = this.subject({
            _userScrollPosition: window.scrollY
        });
        component._retainUserScrollPosition();
        Em.run.later(function(){
            expect(window.scrollY).to.eq(component.get('_userScrollPosition'));
            done();
        }, 10);
    });

    it('#_updateUserScrollPosition should set the _userScrollPosition to the browser\'s current scrollTop.', function(){
        var component = this.subject();
        var top = Em.$(window).scrollTop();
        component._updateUserScrollPosition();
        expect(component.get('_userScrollPosition')).to.eq(top);
    });

});
