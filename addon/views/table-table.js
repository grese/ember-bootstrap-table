import Em from 'ember';
import THead from './table-thead';
import TBody from './table-tbody';
import TFoot from './table-tfoot';
export default Em.ContainerView.extend({
    init: function(){
        this._super();
        this.setProperties({
            thead: THead.create({
                container: this.get('component.container'),
                component: this.get('component')
            }),
            tbody: TBody.create({
                container: this.get('component.container'),
                component: this.get('component')
            }),
            tfoot: TFoot.create({
                container: this.get('component.container'),
                component: this.get('component')
            })
        });
        this.pushObjects([this.get('thead'), this.get('tbody'), this.get('tfoot')]);
    },
    tagName: 'table',
    classNames: ['table-component-table', 'table'],
    classNameBindings: [
        'component.condensed:table-condensed',
        'component.striped:table-striped',
        'component.bordered:table-bordered',
        'component.hoverable:table-hoverable'
    ],
    component: null,
    thead: null,
    tbody: null,
    tfoot: null,
    setup: function(){
        if(!this.get('component.stickyHeader')){
            this.get('thead').insertHeaderCells();
        }
        var self = this;
        Em.run.later(function(){
            self._calculateColumnWidths();
        }, 1);
    },
    columnWidths: [],
    _columnWidthsChanged: Em.observer('columnWidths.[]', function(){
        if(!this.get('component.stickyHeader')){
            this.get('thead').updateColumnWidths();
        }
    }),
    _calculateColumnWidths: function(){
        var self = this,
            firstRow = this.get('tbody').objectAt(0),
            widths = [];
        if(firstRow){
            firstRow.get('childViews').forEach(function(cell){
                var $cell = cell.$();
                if($cell){
                    widths.push($cell.outerWidth());
                }
            });
            self.set('columnWidths', widths);
        }
    },
    toggleRowVisibility: function(viewportTop, viewportBottom){
        this.get('tbody').forEach(function(row){
            var pos = row.$().position();
            if(viewportTop > pos.top || viewportBottom < pos.top){
                row.set('visible', false);
            }else{
                row.set('visible', true);
            }
        });
    },
    updateColumns: function(){
        this.update();
        if(!this.get('component.stickyHeader')){
            this.get('thead').updateHeaderCells();
        }
    },
    update: function(){
        this.get('tbody').removeAllChildren();
        this.get('tbody').insertRows();
    }
});
