
suite('View#fire()', function() {

  test('Should bubble fire events up the view chain', function() {
    var callback = sinon.spy();
    var Foo = view.define({});
    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);

    parent.on('test', callback);
    child2.fire('test');

    assert(callback.called);
  });

  test('Should not propagate core events to avoid confusion', function() {
    var callback = sinon.spy();
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);

    parent.on('destroy', callback);
    parent.on('remove', callback);
    parent.on('insert', callback);

    child.fire('destroy');
    child.fire('remove');
    child.fire('insert');

    assert(!callback.called, 'the callback should not have been called');
  });

  test('Should broadcast some events down the tree', function() {
    var callback = sinon.spy();
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);

    child.on('remove', callback);
    child.on('insert', callback);

    parent.fire('insert');
    parent.fire('remove');

    assert(callback.calledTwice);
  });

});