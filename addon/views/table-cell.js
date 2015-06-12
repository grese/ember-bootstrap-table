import Em from 'ember';
import TDView from './table-td';
import template from '../templates/views/table-cell';

var get = Em.get;

export default TDView.extend({
    template: template,
    classNames: ['table-component-cell'],
    classNameBindings: ['colConfig.cellClassName'],
    colConfig: null,
    row: null,
    cellContent: Em.computed('row', function(){
        var content = '',
            getCellContent = this.get('colConfig.getCellContent'),
            cellValuePath = this.get('colConfig.cellValuePath');
        if(getCellContent){
            content = getCellContent(this.get('row'), this.get('colConfig'));
        }else{
            if(cellValuePath){
                content = (cellValuePath !== null) ? get(this.get('row'), cellValuePath) : '';
            }
        }
        return content.toString();
    }),
    widthChanged: Em.observer(function(){
        this.updateWidth();
    }, 'colConfig.columnWidth'),
    updateWidth: function(){
        if(this.get('colConfig.columnWidth') !== null){
            this.$().css({
                width: this.get('colConfig.columnWidth')
            });
        }
    },
    didInsertElement: function(){
        this.updateWidth();
    }
});
