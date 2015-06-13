import Em from 'ember';
import CustomCell from 'dummy/views/custom-cell';
import CustomHeaderCell from 'dummy/views/custom-header-cell';
export default Em.Controller.extend({
    init: function(){
        this._super();
        var rows = this.generateRandomRows(100);
        this.set('model', rows);
    },
    randomVal: function(min, max){
        return Math.random() * (max - min) + min;
    },
    generateRandomRows: function(count){
        var rows = [];
        var i;
        for(i=0; i<count; i++){
            rows.push(Em.Object.create({
                id: i,
                value: this.randomVal(0, 1000)
            }));
        }
        return rows;
    },
    rows: Em.computed('model.[]', function(){
        return this.get('model');
    }),
    numCols: 2,
    columns: Em.computed('numCols', function(){
        return [
            Em.Object.create({
                headerCellName: 'ID',
                columnWidth: '100px',
                cellValuePath: 'id',
                cellCustomViewClass: CustomCell,
                headerCellCustomViewClass: CustomHeaderCell
            }),
            Em.Object.create({
                headerCellName: 'VALUE',
                columnWidth: '200px',
                getCellContent: function(row){
                    return row.get('value');
                },
                sortable: true,
                sortOn: 'cellValuePath',
                cellValuePath: 'value'
            })
        ];
    }),
    actions: {
        loadMore: function(){
            Em.Logger.debug('LOAD MORE FIRED');
            var currentRows = this.get("model");
            var newRows = this.generateRandomRows(25);
            this.set('model', currentRows.concat(newRows));
        }
    }
});
