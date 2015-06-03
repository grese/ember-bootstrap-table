import { expect } from 'chai';
import { describe, it } from 'mocha';
import Em from 'ember';
import TableIcons from 'ember-bootstrap-table/models/table-icons';

describe('Table Icons', function(){

    it('should exist, and be an Em.Object.', function() {
        var icons = TableIcons.create();
        expect(icons).to.be.an.instanceof(Em.Object);
    });
});
