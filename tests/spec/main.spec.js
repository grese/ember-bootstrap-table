// Set the component:
App.TableComponentComponent = Ember.TableComponent.extend({
	layoutName: null,
	layout: Ember.TEMPLATES['ember-bootstrap-table-template-main']
});
var MockColumnConfigs, MockRows, MockDetailRowView;
moduleForComponent('table-component', 'Table Component', {
	setup: function(){
		MockColumnConfigs = [
			Em.Object.create({
				headerCellName: 'Column ONE',
				getCellContent: function(row){ 
					return ''; 
				}
			}),
			Em.Object.create({
				headerCellName: 'Column TWO',
				getCellContent: function(row){ 
					return ''; 
				}
			}),
			Em.Object.create({
				headerCellName: 'Column THREE',
				getCellContent: function(row){ 
					return ''; 
				}
			})
		];

		MockRows = [
			Em.Object.create({ id: 'row1', someProperty: 'someValue', someOtherProperty: 'someOtherValue' }),
			Em.Object.create({ id: 'row2', someProperty: 'someValue', someOtherProperty: 'someOtherValue' }),
			Em.Object.create({ id: 'row3', someProperty: 'someValue', someOtherProperty: 'someOtherValue' })
		];

		MockDetailRowView = Em.View.extend();
	}
});

test('should render an empty table if no columns are provided.', function() {
	var component = this.subject({
			columns: []
		}),
		$component = this.append(),
		hasTable = false;
	Em.run(function(){
		hasTable = $component.find('table.table.table-component').length > 0;
		equal(hasTable, true, 'The component should render an empty table.');
	});
});

test('should set .table-responsive class on the tables containing div if responsive is true', function() {
	var component = this.subject({
			responsive: true,
			columns: []
		}),
		$component = this.append(),
		isResponsive = false;
	Em.run(function(){
		isResponsive = $component.find('div.table-responsive').length > 0;
		equal(isResponsive, true, 'The table should be responsive');
	});
});

test('should NOT set .table-responsive class on the tables containing div if responsive is false', function() {
	var component = this.subject({
			responsive: false,
			columns: []
		}),
		$component = this.append(),
		nonResponsive = false;
	Em.run(function(){
		nonResponsive = $component.find('div.table-responsive').length === 0;
		equal(nonResponsive, true, 'The table should not be responsive');
	});
});

test('should set .table-hoverable class on the table tag if hoverable is true', function() {
	var component = this.subject({
			hoverable: true,
			columns: []
		}),
		$component = this.append(),
		isHoverable = false;
	Em.run(function(){
		isHoverable = $component.find('table.table.table-component.table-hoverable').length > 0;
		equal(isHoverable, true, 'The table should be hoverable');
	});
});

test('should NOT set .table-hoverable class on the table tag if hoverable is false', function() {
	var component = this.subject({
			hoverable: false,
			columns: []
		}),
		$component = this.append(),
		nonHoverable = false;
	Em.run(function(){
		nonHoverable = $component.find('table.table.table-component.table-hoverable').length === 0;
		equal(nonHoverable, true, 'The table should not be hoverable');
	});
});

test('should set .table-striped class on the table tag if striped is true', function() {
	var component = this.subject({
			striped: true,
			columns: []
		}),
		$component = this.append(),
		isStripey = false;
	Em.run(function(){
		isStripey = $component.find('table.table.table-component.table-striped').length > 0;
		equal(isStripey, true, 'The table should be striped');
	});
});

test('should NOT set .table-striped class on the table tag if striped is false', function() {
	var component = this.subject({
			striped: false,
			columns: []
		}),
		$component = this.append(),
		nonStriped = false;
	Em.run(function(){
		nonStriped = $component.find('table.table.table-component.table-striped').length === 0;
		equal(nonStriped, true, 'The table should not be striped');
	});
});

test('should set .table-bordered class on the table tag if bordered is true', function() {
	var component = this.subject({
			bordered: true,
			columns: []
		}),
		$component = this.append(),
		isBordered = false;
	Em.run(function(){
		isBordered = $component.find('table.table.table-component.table-bordered').length > 0;
		equal(isBordered, true, 'The table should be bordered');
	});
});

test('should NOT set .table-bordered class on the table tag if bordered is false', function() {
	var component = this.subject({
			bordered: false,
			columns: []
		}),
		$component = this.append(),
		nonBordered = false;
	Em.run(function(){
		nonBordered = $component.find('table.table.table-component.table-bordered').length === 0;
		equal(nonBordered, true, 'The table should not be bordered');
	});
});

test('should set .table-condensed class on the table tag if condensed is true', function() {
	var component = this.subject({
			condensed: true,
			columns: []
		}),
		$component = this.append(),
		isCondensed = false;
	Em.run(function(){
		isCondensed = $component.find('table.table.table-component.table-condensed').length > 0;
		equal(isCondensed, true, 'The table should be condensed');
	});
});

test('should NOT set .table-condensed class on the table tag if condensed is false', function() {
	var component = this.subject({
			condensed: false,
			columns: []
		}),
		$component = this.append(),
		nonCondensed = false;
	Em.run(function(){
		nonCondensed = $component.find('table.table.table-component.table-condensed').length === 0;
		equal(nonCondensed, true, 'The table should not be condensed');
	});
});

test('should not render thead if showHeader property is set to false', function() {
	var component = this.subject({
			showHeader: false,
			columns: []
		}),
		$component = this.append(),
		hasTableHead = true;
	Em.run(function(){
		hasTableHead = $component.find('table.table.table-component thead').length > 0;
		equal(hasTableHead, false, 'The table should not have a thead element');
	});
});

test('should render thead if showHeader property is set to true (default)', function() {
	var component = this.subject({
			columns: []
		}),
		$component = this.append(),
		hasTableHead = true;
	Em.run(function(){
		hasTableHead = $component.find('table.table.table-component thead').length > 0;
		equal(hasTableHead, true, 'The table should have a thead element by default');
	});
});

test('should render the correct column headers as defined in the headerCellName property of each column config', function() {
	var component = this.subject({
			columns: MockColumnConfigs
		}),
		$component = this.append(),
		headerCells = true,
		expectedHeaderNames = MockColumnConfigs.map(function(col){
			return col.get('headerCellName');
		}),
		actualHeaderNames = [];
	Em.run(function(){
		headerCells = $component.find('table.table-component thead .table-component-header-name');
		$.each(headerCells, function(idx, item){
			actualHeaderNames.push($(item).text());
		});
		
		deepEqual(actualHeaderNames, expectedHeaderNames, 'The correct column headers should be present.');
	});
});

test('should render the correct column headers and sorting controls for each sortable column config', function() {
	$.each(MockColumnConfigs, function(idx, col){
		// Set the column headers to be sortable.
		col.set('sortable', true);
	});

	var component = this.subject({
			columns: MockColumnConfigs
		}),
		$component = this.append(),
		headerCells = true,
		expectedHeaderNames = MockColumnConfigs.map(function(col){
			return col.get('headerCellName');
		}),
		actualHeaderNames = [];
	Em.run(function(){
		headerCells = $component.find('table.table-component thead .table-component-header-name');
		$.each(headerCells, function(idx, item){
			var $span = $(item).find('span'),
				name = $.trim($span.text()),
				hasSortIcon = $span.find('.fa').length === 1;
			actualHeaderNames.push(name);
			equal(hasSortIcon, true, 'Each sortable column header should have a sort icon');
		});
		
		deepEqual(actualHeaderNames, expectedHeaderNames, 'The correct column headers should be present.');
	});
});

test('#_columns property should return an array of column configurations if columns are provided', function(){
	var component = this.subject({
			columns: MockColumnConfigs
		}),
		cols = component.get('_columns');
	equal(cols.length, 3, 'should return array of column configs');
});

test('#_columns property should return an empty array if columns is null', function(){
	var component = this.subject({
			columns: null
		}),
		cols = component.get('_columns');
	deepEqual(cols, [], 'should be an empty array.');
});

test('#_rows property should return an empty array if rows is null', function(){
	var component = this.subject({
			columns: [],
			rows: null
		}),
		parsedRows = component.get('_rows');
	deepEqual(parsedRows, [], 'should be an empty array.');
});

test('#_rows property should return an array of instances of Em.ObjectProxy', function(){
	var component = this.subject({
			columns: [],
			rows: MockRows
		}),
		parsedRows = component.get('_rows');
	$.each(parsedRows, function(idx, row){
		var isObjProxy = row instanceof Ember.ObjectProxy;
		ok(isObjProxy, 'should be instane of Em.ObjectProxy');
	});
});

test('items from #_rows property should all have both the properties of the original object, and the _rowIndex and _rowDetailVisible properties.', function(){
	var component = this.subject({
			columns: [],
			rows: MockRows
		}),
		parsedRows = component.get('_rows');

	$.each(parsedRows, function(idx, row){
		var origRow = MockRows[idx];
		strictEqual(row.get('id'), origRow.get('id'), 'id property should have been carried over.');
		strictEqual(row.get('someProperty'), origRow.get('someProperty'), 'someProperty property should have been carried over.');
		strictEqual(row.get('someOtherProperty'), origRow.get('someOtherProperty'), 'someOtherProperty property should have been carried over.');
		
		strictEqual(row.get('_rowIndex'), idx);
		strictEqual(row.get('_rowDetailVisible'), false);
	});
});

test('#_rows property should return an array of the rows provided with _rowIndex, and _rowDetailVisible properties set.', function(){
	var component = this.subject({
			columns: [],
			rows: MockRows
		}),
		parsedRows = component.get('_rows');

	strictEqual(parsedRows.length, MockRows.length, 'should have same number of array elements');
	$.each(parsedRows, function(idx, row){
		strictEqual(row.get('_rowIndex'), idx, 'row should have the correctr index');
		strictEqual(row.get('_rowDetailVisible'), false, 'should be false by default');
	});
});

test('#_detailRowsEnabled should return false if hasDetailRows property is false', function(){
	var component = this.subject({
			columns: [],
			hasDetailRows: false
		}),
		detailRowsEnabled = component.get('_detailRowsEnabled');
	equal(detailRowsEnabled, false, 'should return false');
});

test('#_detailRowsEnabled should return false if hasDetailRows property is true, but there is no detailRowViewClass specified', function(){
	var component = this.subject({
			columns: [],
			hasDetailRows: true
		}),
		detailRowsEnabled = component.get('_detailRowsEnabled');
	equal(detailRowsEnabled, false, 'should return false');
});

test('#_detailRowsEnabled should return true if hasDetailRows property is true, and a detailRowViewClass is provided', function(){
	
	var component = this.subject({
			columns: [],
			hasDetailRows: true,
			detailRowViewClass: MockDetailRowView
		}),
		detailRowsEnabled = component.get('_detailRowsEnabled');
	equal(detailRowsEnabled, true, 'should return true');
});

test('#_numColumns should return the number of columns specified', function(){
	var component = this.subject({
			columns: MockColumnConfigs
		}),
		numCols = component.get('_numColumns');
	equal(numCols, 3, 'should have 3 columns');
});

test('#_rowColspan should return (_numColumns + 1) if useDefaultDetailRowToggle is true', function(){
	var component = this.subject({
			columns: MockColumnConfigs
		}),
		numCols = component.get('_rowColspan');
	equal(numCols, 4, 'should have 4 columns');
});

test('#_rowColspan should return the same value as _numColumns if useDefaultDetailRowToggle is false', function(){
	var component = this.subject({
			columns: MockColumnConfigs,
			useDefaultDetailRowToggle: false
		}),
		numCols = component.get('_rowColspan');
	equal(numCols, 3, 'should have 3 columns');
});

test('should render an extra empty column header cell if useDefaultDetailRowToggle is true', function(){
	var component = this.subject({
			columns: MockColumnConfigs,
			hasDetailRows: true,
			detailRowViewClass: MockDetailRowView
		}),
		$component = this.append();

	var expectedNumCols = MockColumnConfigs.length + 1,
		headers = $component.find('table.table-component th.table-component-header');
	strictEqual(headers.length, expectedNumCols, 'should have an extra header cell');

	var cellIsEmpty = $.trim($(headers[0]).text()) === "";
	strictEqual(cellIsEmpty, true, 'extra header cell should be empty');
});

test('should NOT render an extra column header if useDefaultDetailRowToggle is false', function(){
	var component = this.subject({
			columns: MockColumnConfigs,
			hasDetailRows: true,
			detailRowViewClass: MockDetailRowView,
			useDefaultDetailRowToggle: false
		}),
		$component = this.append();

	var expectedNumCols = MockColumnConfigs.length,
		headers = $component.find('table.table-component th.table-component-header');
	strictEqual(headers.length, expectedNumCols, 'should NOT have an extra header cell');
});

test('should render an extra cell in each row with a button to toggle the detail view for the row if useDefaultDetailRowToggle is true', function(){
	var component = this.subject({
			columns: MockColumnConfigs,
			hasDetailRows: true,
			detailRowViewClass: MockDetailRowView,
			rows: MockRows
		}),
		$component = this.append();

	var expectedNumCols = MockColumnConfigs.length + 1,
		$row1 = $component.find('table.table-component tbody tr').eq(0),
		cells = $row1.find('td');
	strictEqual(cells.length, expectedNumCols, 'should have extra cell');

	var $cell1 = $(cells.eq(0)),
		hasButton = $cell1.find('.toggle-detail-row').length === 1;
	strictEqual(hasButton, true, 'should have a toggle button');
});

test('should render a detail-row for each row if hasDetailRows is true, and detailRowViewClass is provided.', function(){
	var component = this.subject({
			columns: MockColumnConfigs,
			hasDetailRows: true,
			detailRowViewClass: MockDetailRowView,
			rows: MockRows
		}),
		$component = this.append();

	var expectedNumRows = MockColumnConfigs.length * 2,
		numRows = $component.find('table.table-component tbody tr').length;
	strictEqual(numRows, expectedNumRows, 'should have twice as many rows');
});

test('when _detailRowsEnabled returns true, #attachDetailRowClickHandlers should be called, and an observer set.', function(){
	var component = this.subject({
			columns: MockColumnConfigs,
			hasDetailRows: true,
			detailRowViewClass: MockDetailRowView,
			rows: MockRows
		});
	sinon.spy(component, 'attachDetailRowClickHandlers');
	sinon.spy(component, 'addObserver');
	var $component = this.append();
	Em.run(function(){
		ok(component.attachDetailRowClickHandlers.calledOnce, 'should have fired #attachDetailRowClickHandlers');
		ok(component.attachDetailRowClickHandlers.calledOnce, 'should have added observer');
	});
});

test('#_showLoadingRow should return true if infiniteScrollEnabled is true, and if isLoadingRows is true', function(){
	var component = this.subject({
		columns: [],
		infiniteScrollEnabled: true,
		isLoadingRows: true
	});

	var showLoadingRow = component.get('_showLoadingRow');
	ok(showLoadingRow, 'should return true.');
});

test('#_showLoadingRow should return false if infiniteScrollEnabled is false, or if isLoadingRows is false', function(){
	var component = this.subject({
		columns: [],
		infiniteScrollEnabled: false
	});

	var notShowLoadingRow = !component.get('_showLoadingRow');
	ok(notShowLoadingRow, 'should return false.');

	Em.run(function(){
		component.set('isLoadingRows', true);
		notShowLoadingRow = !component.get('_showLoadingRow');
		ok(notShowLoadingRow, 'should return false.');

		component.setProperties({
			infiniteScrollEnabled: true,
			isLoadingRows: false
		});
		notShowLoadingRow = !component.get('_showLoadingRow');
		ok(notShowLoadingRow, 'should return false.');		
	});
});

test('should fire #attachInfiniteScrollListener after didInsertElement hook if infiniteScrollEnabled is true', function(){
	
	var component = this.subject({
		columns: [],
		infiniteScrollEnabled: true
	});
	sinon.spy(component, 'attachInfiniteScrollListener');

	this.append();
	Em.run(function(){
		ok(component.attachInfiniteScrollListener.calledOnce, 'should have called attachInfiniteScrollListener');
	});
});

test('should NOT fire #attachInfiniteScrollListener after didInsertElement hook if infiniteScrollEnabled is false', function(){
	
	var component = this.subject({
		columns: [],
		infiniteScrollEnabled: false
	});
	sinon.spy(component, 'attachInfiniteScrollListener');

	this.append();
	Em.run(function(){
		var notCalled = !component.attachInfiniteScrollListener.called;
		ok(notCalled, 'should NOT have called attachInfiniteScrollListener');
	});
});

test('#_loadMoreRows function should send an action if the loadMoreAction is supplied, and the isLoadingRows property is false', function(){
	var MockActionName = 'someaction',
		component = this.subject({
			isLoadingRows: false,
			loadMoreAction: MockActionName
		});
	sinon.spy(component, 'sendAction');
	this.append();

	component._loadMoreRows();
	Em.run(function(){
		var calledWith = component.sendAction.calledWith(MockActionName);
		ok(calledWith, 'should have called sendAction with correct action name');
	});
});

test('#_loadMoreRows function should NOT send an action if the loadMoreAction is supplied, and the isLoadingRows property is true', function(){
	var MockActionName = 'someaction',
		component = this.subject({
			isLoadingRows: true,
			loadMoreAction: MockActionName
		});
	sinon.spy(component, 'sendAction');
	this.append();

	component._loadMoreRows();
	Em.run(function(){
		var notCalled = !component.sendAction.called;
		ok(notCalled, 'should NOT have called sendAction');
	});
});

test('#_loadMoreRows function should NOT send an action if the loadMoreAction is NOT supplied, and the isLoadingRows property is false', function(){
	var component = this.subject({
			isLoadingRows: false,
			loadMoreAction: null
		});
	sinon.spy(component, 'sendAction');
	this.append();

	component._loadMoreRows();
	Em.run(function(){
		var notCalled = !component.sendAction.called;
		ok(notCalled, 'should NOT have called sendAction');
	});
});























