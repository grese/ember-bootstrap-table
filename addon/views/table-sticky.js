import Em from 'ember';
import THead from './table-thead';
export default Em.ContainerView.extend({
    init: function(){
        this._super();
        this.set('thead', this.createChildView(THead, {
            component: this.get('component')
        }));
    },
    tagName: 'div',
    classNames: ['table-component-sticky-header-table', 'table'],
    component: null,
    thead: null,
    setup: function(){
        if(this.get('component.stickyHeader')){
            this.get('thead').insertHeaderCells();
            this.updateColumns();
        }
    },
    updateColumns: function(){
        this.get('thead').updateHeaderCells();
        var self = this;
        Em.run.later(function(){
            self.get('thead').updateColumnWidths();
        }, 1);
    }
});
