import Em from 'ember';
export default Em.View.extend({
    tagName: 'td',
    attributeBindings: ['colspan', 'rowspan']
});
