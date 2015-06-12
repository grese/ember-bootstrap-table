import TRView from './table-tr';
import CellView from './table-cell';
export default TRView.extend({
    classNames: ['table-component-row'],
    component: null,
    rowData: null,
    insertCells: function(){
        var self = this;
        var cellViews = [];
        this.get('component._cols').forEach(function(col){
            cellViews.push(CellView.create({
                component: self.get('component'),
                container: self.get('component.container'),
                row: self.get('rowData.content'),
                colConfig: col
            }));
        });
        this.pushObjects(cellViews);
    }
});
