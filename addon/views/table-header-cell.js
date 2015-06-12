import Em from 'ember';
import THView from './table-th';
import template from '../templates/views/table-header-cell';
export default THView.extend({
    template: template,
    tagName: 'div',
    classNames: ['table-component-header-cell', 'table-component-th'],
    classNameBindings: ['colConfig.headerCellClassName'],
    component: null,
    colConfig: null,
    sortIconClass: Em.computed('component.sortIndex', 'component.sortAscending', function(){
        var currentIdx = this.get('component.sortIndex'),
            thisIdx = this.get('colConfig._columnIndex');
        if(currentIdx === thisIdx){
            return this.get('component.sortAscending') ?
                this.get('component._icons.sortAsc') : this.get('component._icons.sortDesc');
        }else{
            return this.get('component._icons.sortable');
        }
    }),
    updateWidth: function(){
        if(this.get('colConfig.columnWidth') !== null){
            this.$().css({
                width: this.get('colConfig.columnWidth')
            });
        }
    },
    widthChanged: Em.observer(function(){
        this.updateWidth();
    }, 'colConfig.columnWidth'),
    didInsertElement: function(){
        this.updateWidth();
        if(this.get('component.showTooltips') && this.get('colConfig.headerCellInfo')){
            this.$().find("[data-toggle='tooltip']").tooltip();
        }
    }
});
