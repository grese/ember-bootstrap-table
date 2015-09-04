import Em from 'ember';
import TRView from './table-tr';
import LoadingCell from './table-loading';
export default Em.ContainerView.extend({
    tagName: 'div',
    classNames: ['table-component-tfoot'],
    component: null,
    init: function(){
        this._super();
        var loadingRow;
        if(this.get('component.infiniteScrollEnabled')){
            loadingRow = this.createChildView(TRView, {
                classNames: ['table-component-loading-row'],
                component: this.get('component')
            });
            loadingRow.createChildView(LoadingCell, {
                component: this.get('component')
            });
            this.set('loadingRow', loadingRow);
        }
    }
});
