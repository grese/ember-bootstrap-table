# ember-bootstrap-table
An ember table component to help create dynamic bootstrap tables in ember.

## Dependencies:
* Ember
* Bootstrap v3
* fontawesome (just for icons)

## Installation:
* This component is available as a bower dependency:  `bower install --save ember-bootstrap-table`
* Alternatively, you can just download it as a zip file and manually include the contents of the 'dist' folder in your project.

## Usage:
#### Files:
You'll need to include the following files in your project:
* dist/ember-bootstrap-table.min.js
* dist/ember-bootstrap-table.css

#### Parameters:
* columns: [] *// *REQUIRED (array of column configs)*
* rows: [] *// (array of rows)*
* showHeader: (true || false) *// (Shows/hides the table header)*
* hoverable: (true || false) *// (Adds hover states to row background)*
* striped: (true || false) *// (Stripes the table)*
* condensed: (true || false) *// (Condenses table rows)*
* responsive: (true || false) *// (Makes table horizontally scrollable)*
* bordered: (true || false) *// (Adds borders to the table)*
* customSortAction: "[Action Name]" *// (The action that will fire when a user has clicked a sortable column header.  Set this parameter to override the default sorting behavior of the table.  The action will be fired with two parameters:  'columnIndex', and 'isAscending'  When specified, this will make the .sort property on your column configs inactive.)*
* sortIndex: "[Property to Sort On]" *// (only active if customSortAction is null)*
* sortAscending: (true || false) *// (only active if customSortAction is null)*
* rowDetailViewClass: (null || [Instance of Ember.View]) *// (Defines a custom view for the detail rows - only used when hasDetailRows is true)*
* hasDetailRows:  (true || false) *// (enabled/disables detail rows)*
* useDefaultDetailRowToggle: (true || false) *// (when true, an extra column will be added to the table to allow the user to show and hide the detail rows.  If false, you must provide your own mechanism for showing/hiding the detail rows)*
* infiniteScrollEnabled: (true || false) *// (whether or not infinite scroll should be enabled)*
* isLoadingRows: (true || false) *// (a flag to bind to for showing/hiding the table's loading indicator - only used when infiniteScrollEnabled is true)*
* loadMoreAction: "[Action Name]" *// (the action that should be fired when user scrolls to bottom of page - only used when infiniteScrollEnabled is true, and isLoadingRows is false)*
* noContentView: [Instance of Em.View] *// (this view will be rendered instead of the table if there are no rows.)*
* useRenderingIndicator: (true || false) *// (True by default.  When true, this will disable the adding of a rendering indicator to the table when the table is taking a while to render)*

#### Column Configurations:
Here are the options for configuring columns:
* headerCellName: "[Cell Header Text]" *// (only used if headerCellCustomViewClass is null)*
* headerCellClassName: "classname1 classname2" *// (only used if headerCellCustomViewClass is null)*
* headerCellInfo: "this info will be shown in a tooltip." *// (only used if headerCellCustomViewClass is null)*
* headerCellCustomViewClass: (null || [Instance of Ember.View]) *// (Defines a custom view for header cell)*
* cellValuePath: (null || "Path to value") *// (Defines the property of row where value is -- Only used if customCellViewClass and getCellContent are both null)*
* cellClassName: "classname1 classname2" *// (only used if cellCustomViewClass is null)*
* cellCustomViewClass: (null || [Instance of Ember.View]) *// (Defines a custom view for the cell)*
* getCellContent: (null || function) *// (Defines a function to return value for cell - Only used if customCellViewClass is null)*
* columnWidth: (null || int) *// (Defines a fixed width for the column)*
* sort: function(column, rows, isAscending){  } *// (The function used to sort this column.  Only active when the customSortAction is null.)*
* sortOn: 'cellValuePath' || 'getCellContent' // (This will tell the default sorting function to sort on the cellValuePath or getCellContent function if both are specified in your column config.  Inactive when customSortAction is provided.)*

*(All column configs must have cellCustomViewClass, cellValuePath, or getCellContent defined)*

**Example Column Configs:**
```javascript
import CustomHeaderCell from 'app/views/custom-header-view';
import CustomCell from 'app/views/custom-cell-view';
import DetailRow from 'app/views/detail-row-view';

export default Ember.Controller.extend({
  columns: function(){
    return [
      Ember.Object.create({
        headerCellName: 'Col 1',
        getCellContent: function(row){
          return row.get('someValue') + '%';
        },
        columnWidth: 50
      }),
      Ember.Object.create({
        headerCellCustomViewClass: CustomHeaderCell,
        cellValuePath: 'someOtherValue', // will return row.get('someOtherValue');
      }),
      Ember.Object.create({
        headerCellName: 'Col 3',
        cellCustomViewClass: CustomCell // will create an instance of CustomCell and pass 'row' property to it
      })
    ];
  }.property(),
  rows: function(){
    return this.get('model') || [];
  }.property('model.[]'),
  detailRowViewClass: function(){
    return DetailRow;
  }.property(),
  isLoadingData: false,
  actions: {
    loadMore: function(){
      var self = this;
      this.set('isLoadingData', true);
      this.store.find('somemodel').then(function(result){
        self.set('model', result);
        self.set('isLoadingData', false);
      });
    },
    sortTheTable: function(columnIndex, isAscending){

    }
  }
});
```

#### Example:
```javascript
{{table-component
  rows=rows
  columns=columns
  showHeader=true
  sortable=false
  hoverable=true
  condensed=false
  responsive=true
  bordered=false
  striped=true
  hasDetailRows=true
  rowDetailViewClass=detailRowViewClass
  useDefaultDetailRowToggle=true
  infiniteScrollEnabled=true
  isLoadingRows=isLoadingData
  loadMoreAction='loadMore'
  customSortAction='sortTheTable'
}}
```
