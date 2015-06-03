import { expect } from 'chai';
import { describe, it } from 'mocha';
import Em from 'ember';
import TableRow from 'ember-bootstrap-table/models/table-row';

describe('Table Row', function(){

    it('should exist, and be an Em.ObjectProxy.', function() {
        var row = TableRow.create();
        expect(row).to.be.an.instanceof(Em.ObjectProxy);
    });
});
