import TRView from './table-tr';
import CellView from './table-cell';
export default TRView.extend({
    classNames: ['table-component-row'],
    component: null,
    rowData: null,
    insertCells: function(){
        var self = this;
        this.get('component._cols').forEach(function(col){
            self.createChildView(CellView, {
                component: self.get('component'),
                row: self.get('rowData.content'),
                colConfig: col
            });
        });
    }
});
