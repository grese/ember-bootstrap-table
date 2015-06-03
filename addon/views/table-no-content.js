import Em from 'ember';
import template from '../templates/views/table-no-content';
export default Em.View.extend({
    tagName: 'div',
    classNames: ['table-component-no-content'],
    template: template
});
