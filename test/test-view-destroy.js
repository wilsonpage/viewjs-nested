
suite('View#destroy()', function() {

	test('Should call original destroy method on each descendent', function() {
		View.prototype.plugins.push(ViewChildren);

    var Foo = View.extend({});
		var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    // Spy on original destory methods
    var destroySpy1 = sinon.spy(child1, '_destroy');
    var destroySpy2 = sinon.spy(child2, '_destroy');

    child1.add(child2);
    parent.add(child1);

    parent.destroy();

    assert(destroySpy1.called);
    assert(destroySpy2.called);
	});

  test('Should call remove on the root callee only', function() {
    View.prototype.plugins.push(ViewChildren);

    var Foo = View.extend({});
    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);

    var remove = {
      parent: sinon.spy(parent, 'remove'),
      child1: sinon.spy(child1, 'remove'),
      chil2: sinon.spy(child2, 'remove')
    };

    parent.destroy();

    assert(remove.parent.called);
    assert(!remove.child1.called);
    assert(!remove.child1.called);
  });

});