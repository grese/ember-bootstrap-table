import Em from 'ember';
import RowView from './table-row';

export default Em.ContainerView.extend({
    tagName: 'tbody',
    classNames: ['table-component-tbody'],
    component: null,
    insertRows: function(){
        var self = this;
        var rowViews = [];
        this.get('component._rows').forEach(function(row){
            var rowView = RowView.create({
                component: self.get('component'),
                container: self.get('component.container'),
                rowData: row
            });
            rowView.insertCells();
            rowViews.push(rowView);
        });
        this.pushObjects(rowViews);
    }
});
