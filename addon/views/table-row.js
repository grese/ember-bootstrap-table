import TRView from './table-tr';
import CellView from './table-cell';
export default TRView.extend({
    classNames: ['table-component-row'],
    classNameBindings: ['visible::invisible'],
    component: null,
    rowData: null,
    visible: true,
    insertCells: function(){
        var self = this;
        var cellViews = [];
        this.get('component._cols').forEach(function(col){
            var CellViewClass = col.get('cellCustomViewClass') || CellView;
            cellViews.push(CellViewClass.create({
                component: self.get('component'),
                container: self.get('component.container'),
                row: self.get('rowData.content'),
                colConfig: col
            }));
        });
        this.pushObjects(cellViews);
    }
});
