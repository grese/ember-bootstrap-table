import Em from 'ember';
import RowView from './table-row';

export default Em.ContainerView.extend({
    tagName: 'div',
    classNames: ['table-component-tbody'],
    component: null,
    insertRows: function(){
        var self = this;
        this.get('component._rows').forEach(function(row){
            var row = self.createChildView(RowView, {
                component: self.get('component'),
                rowData: row
            });
            row.insertCells();
        });
    }
});
