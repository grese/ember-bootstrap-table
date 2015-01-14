module("Basic Tests");

test("Component", function() {
    notEqual(null, Ember.TableComponent, "Ember.TableComponent exists"); 
});

test("Templates", function() {
    notEqual(null, Ember.TEMPLATES['table-component-template-main'], "Ember.TEMPLATES['table-component-template-main'] exists");
});