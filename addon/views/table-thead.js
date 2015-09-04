import Em from 'ember';
import TRView from './table-tr';
import HeaderCellView from './table-header-cell';
export default Em.ContainerView.extend({
    tagName: 'div',
    classNames: ['table-component-thead'],
    component: null,
    insertHeaderCells: function(){
        var self = this;

        var row = this.createChildView(TRView, {});
        this.get('component._cols').forEach(function(col){
            row.createChildView(HeaderCellView, {
                colConfig: col,
                component: self.get('component')
            });
        });
    },
    updateColumnWidths: function(){
        var colWidths = this.get('component._table.columnWidths');
        var row = this.objectAt(0);
        if(row){
            row.get('childViews').forEach(function(cell, idx){
                var $cell = cell.$();
                var width = colWidths[idx];
                if($cell && (width !== undefined)){
                    $cell.css({width: width});
                }
            });
        }
    },
    updateHeaderCells: function(){
        this.removeAllChildren();
        this.insertHeaderCells();
    }
});
