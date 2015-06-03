import Em from 'ember';
import TDView from './table-td';
import template from '../templates/views/table-cell';

var get = Em.get;

export default TDView.extend({
    template: template,
    classNames: ['table-component-cell'],
    classNameBindings: ['colConfig.cellClassName'],
    attributeBindings: ['width'],
    colConfig: null,
    row: null,
    width: Em.computed('colConfig.columnWidth', function(){
        return this.get('colConfig.columnWidth');
    }),
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
    })
});
