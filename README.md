# ember-bootstrap-table
An ember table component to help create dynamic bootstrap tables in ember.

## Dependencies:
* Ember
* Bootstrap v3
* fontawesome (just for icons)

## Usage:
#### Parameters:
* columns: [] // *REQUIRED (array of column configs)
* rows: [] // (array of rows) 
* hoverable: (true || false) // (Adds hover states to row background)
* striped: (true || false) // (Stripes the table)
* condensed: (true || false) // (Condenses table rows)
* responsive: (true || false) // (Makes table horizontally scrollable)
* bordered: (true || false) // (Adds borders to the table)
* customSortAction: "<Action Name>" // (Overrides default sortAction)
* sortProperty: "<Property to Sort On>" // (only active if customSortAction is null)
* sortAscending: (true || false) // (only active if customSortAction is null)
* defaultSortProperty: "<Default sortProperty>" // (only active if customSortAction is null)
```javascript

{{table-component
  rows=rows
  columns=columns
  sortable=false
  hoverable=true
  condensed=false
  responsive=true
  bordered=false
  striped=true
  sortProperty=
}}
```
