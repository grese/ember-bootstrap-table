import Em from 'ember';
var get = Em.get;
export default Em.Object.extend({
    headerCellName: '',
    headerCellClassName: null,
    headerCellCustomViewClass: null,
    headerCellInfo: null,
    cellValuePath: null,
    cellClassName: null,
    cellCustomViewClass: null,
    getCellContent: null,
    columnWidth: null,
    sortAscending: true,
    _columnIndex: null,
    sortOn: null,
    sort: function(column, rows, isAscending){
        rows = rows || [];
        column = column || Em.Object.create();
        var getCellContent = get(column, 'getCellContent'),
            valuePath = get(column, 'cellValuePath'),
            sortOnCellValuePath = get(column, 'sortOn') && (get(column, 'sortOn') === 'cellValuePath'),
            useGetCellContent = (getCellContent && !sortOnCellValuePath);
        // Fix for Ember array not having .sort method.
        if(!rows.sort && rows.get('content')){
            rows = rows.get('content');
        }

        if(!valuePath && !getCellContent){
            Em.Logger.warn('<Warning:> Table component\'s default sorting function requires that either ' +
                'cellValuePath or getCellContent are specified for each sortable column.  ' +
                'You must either specify one of these params to ' +
                'return the value for this column, or override this column\'s sort function. ', column);
            return rows;
        }

        return rows.sort(function(a, b){
            var aVal = useGetCellContent ? getCellContent(a, column) : get(a, valuePath),
                bVal = useGetCellContent ? getCellContent(b, column) : get(b, valuePath);
            if(isAscending){
                if(aVal < bVal){ return -1; }
                if(aVal > bVal){ return 1; }
            }else{
                if(aVal > bVal){ return -1; }
                if(aVal < bVal){ return 1; }
            }
            return 0;
        });
    },
    _hasTooltipText: Em.computed('headerCellInfo', function(){
        return this.get('headerCellInfo') ? true : false;
    })
});
