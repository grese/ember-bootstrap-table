import Em from 'ember';
import THView from './table-th';
import template from '../templates/views/table-header-cell';
export default THView.extend({
    template: template,
    tagName: 'div',
    classNames: ['table-component-header-cell', 'table-component-th'],
    classNameBindings: ['colConfig.headerCellClassName'],
    attributeBindings: ['colspan', 'rowspan', 'width'],
    component: null,
    colConfig: null,
    width: Em.computed('colConfig.columnWidth', function(){
        return this.get('colConfig.columnWidth');
    }),
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
    didInsertElement: function(){
        if(this.get('component.showTooltips') && this.get('colConfig.headerCellInfo')){
            this.$().find("[data-toggle='tooltip']").tooltip();
        }
    }
});
