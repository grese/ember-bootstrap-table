import Em from 'ember';
import TDView from './table-td';
import template from '../templates/views/table-loading';
export default TDView.extend({
    template: template,
    classNames: ['table-component-loading-cell'],
    component: null,
    colspan: Em.computed('component._colspan', function(){
        return this.get('component._colspan');
    })
});
