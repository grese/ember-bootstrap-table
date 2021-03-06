# Ember-bootstrap-table
[![Build Status](http://api.screwdriver.corp.yahoo.com:4080/badge/40272/component/icon)](http://api.screwdriver.corp.yahoo.com:4080/badge/40272/component/target)

An ember table component to help create dynamic bootstrap tables in ember.

## EOL
This repo has reached the end of its life. Should no longer be used.

## Usage:

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
* infiniteScrollEnabled: (true || false) *// (whether or not infinite scroll should be enabled)*
* isLoadingRows: (true || false) *// (a flag to bind to for showing/hiding the table's loading indicator - only used when infiniteScrollEnabled is true)*
* loadMoreAction: "[Action Name]" *// (the action that should be fired when user scrolls to bottom of page - only used when infiniteScrollEnabled is true, and isLoadingRows is false)*
* noContentView: [Instance of Em.View] *// (this view will be rendered instead of the table if there are no rows.)*
* disableSortDirection: (true || false) *// (False by default.) When true, the sortAscending property will not change when the user clicks a column header (The sortAscending property will remain unchanged)*
* stickyHeaders: (true || false) *//(False by default). When true, the headers will be rendered into their own table, which will become sticky when the window scrolls to the position specified by "stickyHeaderActivatePosition".*
* stickyHeaderActivatePosition: int value *//(90 by defualt). stickyHeaders will become active when the user scrolls to this y position.  disabled when stickyHeaders is false.*

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
  infiniteScrollEnabled=true
  isLoadingRows=isLoadingData
  loadMoreAction='loadMore'
  customSortAction='sortTheTable'
  sortAscending=false
  disableSortDirection=false
  stickyHeaders=true
  stickyHeaderActivatePosition=100
}}
```

## Installation (Development)

* `git clone` this repository
* `npm install`
* `bower install`

## Running  (Development)

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests  (Development)

* `ember test`
* `ember test --server`

## Building  (Development)

* `ember build`

## Dist
Before submitting a PR for this repo, please run the following grunt command to ensure that your changes will also
be available for those who are using the globals version of this project.
* `grunt dist`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
