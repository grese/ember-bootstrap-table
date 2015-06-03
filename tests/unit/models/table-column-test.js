import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import Em from 'ember';
import TableColumn from 'ember-bootstrap-table/models/table-column';

describe('Table Column', function(){

    var mockRows, mockColumn;
    beforeEach(function(){
        mockColumn = {
            cellValuePath: 'value'
        };
        mockRows = [
            {id: 0, value: 100},
            {id: 1, value: 500},
            {id: 2, value: 250},
            {id: 3, value: 250}
        ];
    });

    it('should exist, and be an Em.Object.', function() {
        var column = TableColumn.create();
        expect(column).to.be.an.instanceof(Em.Object);
    });

    it('#sort should just return the rows if neither cellValuePath nor getCellContent are defined on the column', function(){
        delete mockColumn.cellValuePath;
        var column = TableColumn.create();
        var sorted = column.sort(mockColumn, mockRows);
        expect(sorted).to.eql(mockRows);
    });

    it('#sort should convert an ember-data record array to a regular array before sorting if rows is an ember-data array.', function(){
        var column = TableColumn.create();
        var mockRecordArray = Em.Object.create({
            content: mockRows
        });
        var sorted = column.sort(mockColumn, mockRecordArray);
        expect(sorted).to.eql(mockRows);
    });

    it('#sort should use getCellContent if it is defined on the column', function(){
        mockColumn.getCellContent = function(row){
            return row.value;
        };
        var spy = sinon.spy(mockColumn, 'getCellContent');
        var column = TableColumn.create();
        var expected = [mockRows[0], mockRows[2], mockRows[3], mockRows[1]];
        var sorted = column.sort(mockColumn, mockRows, true);
        expect(spy.called).to.be.ok;
        expect(sorted).to.eql(expected);
    });

    it('#sort should use cellValuePath instead of getCellContent if sortOn is cellValuePath', function(){
        mockColumn.getCellContent = function(row){
            return row.value;
        };
        mockColumn.sortOn = 'cellValuePath';
        var spy = sinon.spy(mockColumn, 'getCellContent');
        var column = TableColumn.create();
        var expected = [mockRows[0], mockRows[2], mockRows[3], mockRows[1]];
        var sorted = column.sort(mockColumn, mockRows, true);
        expect(spy.called).not.to.be.ok;
        expect(sorted).to.eql(expected);
    });

    it('#sort should sort in ascending order when isAscending is true.', function(){
        var column = TableColumn.create();
        // test ascending:
        var expectedAsc = [mockRows[0], mockRows[2], mockRows[3], mockRows[1]];
        var sortedAsc = column.sort(mockColumn, mockRows, true);
        expect(sortedAsc).to.eql(expectedAsc);

    });

    it('#sort should sort in descending order when isAscending is false.', function(){
        var column = TableColumn.create();
        // test descending:
        var expectedDesc = [mockRows[1], mockRows[2], mockRows[3], mockRows[0]];
        var sortedDesc = column.sort(mockColumn, mockRows, false);
        expect(sortedDesc).to.eql(expectedDesc);
    });

    it('#_hasTooltipText should return true if headerCellInfo is populated, and false otherwise', function(){
        var column = TableColumn.create({
            headerCellInfo: 'tooltip text!'
        });
        expect(column.get('_hasTooltipText')).to.be.ok;

        Em.run(function(){
            column.set('headerCellInfo', '');
        });
        expect(column.get('_hasTooltipText')).not.to.be.ok;
    });
});
