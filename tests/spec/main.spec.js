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