// Set the component:
App.TableComponentComponent = Ember.TableComponent.extend({
	layoutName: null,
	layout: Ember.TEMPLATES['ember-bootstrap-table-template-main']
});
var MockColumnConfigs;
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