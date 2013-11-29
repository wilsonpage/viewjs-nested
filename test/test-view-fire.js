
suite('View#fire()', function() {

  test('Should bubble fire events up the view chain', function() {
    View.prototype.plugins.push(ViewChildren);

    var callback = sinon.spy();
    var Foo = View.extend({});
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
    View.prototype.plugins.push(ViewChildren);

    var callback = sinon.spy();
    var Foo = View.extend({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);

    parent.on('before initialize', callback);
    parent.on('initialize', callback);
    parent.on('destroy', callback);
    parent.on('remove', callback);
    parent.on('inserted', callback);

    child.fire('before initialize');
    child.fire('initialize');
    child.fire('destroy');
    child.fire('remove');
    child.fire('inserted');

    assert(!callback.called, 'the callback should not have been called');
  });

});