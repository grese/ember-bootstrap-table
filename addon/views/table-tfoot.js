import Em from 'ember';
import TRView from './table-tr';
import LoadingCell from './table-loading';
export default Em.ContainerView.extend({
    tagName: 'tfoot',
    classNames: ['table-component-tfoot'],
    component: null,
    init: function(){
        this._super();
        var loadingRow, loadingCell;
        if(this.get('component.infiniteScrollEnabled')){
            loadingRow = TRView.create({
                classNames: ['table-component-loading-row'],
                component: this.get('component'),
                container: this.get('component.container')
            });
            loadingCell = LoadingCell.create({
                component: this.get('component'),
                container: this.get('component.container')
            });
            loadingRow.pushObject(loadingCell);
            this.set('loadingRow', loadingRow);
            this.pushObject(this.get('loadingRow'));
        }
    }
});
