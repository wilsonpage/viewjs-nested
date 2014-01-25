
suite('View#remove()', function() {

  test('Should remove self if no arguments given', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);
    child.remove();

    assert(!child.parent);
    assert(!~parent.nested.indexOf(child));
  });

  test('Should clear reference to the parent view', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);
    assert(child.parent === parent);
    parent.remove(child);
    assert(!child.parent);
  });

  test('Should remove the given child from the children array', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    parent.add(child1);
    parent.add(child2);

    parent.remove(child1);

    assert(!~parent.nested.indexOf(child1));
  });

  test('Should clear any slot or name references on the children array/object', function() {
    var Foo = view.define({ name: 'foo' });
    var parent = new Foo();
    var child = new Foo();

    parent.add(child, 'slot');

    assert(parent.nested.slot);
    assert(parent.nested.foo);

    parent.remove(child);

    assert(!parent.nested.slot);
    assert(!parent.nested.foo);
  });

  test('Should be removed from the DOM', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);
    parent.appendTo(document.body);
    parent.remove();

    assert(parent.inDOM() === false);
  });

  test('Should remove child views from the DOM', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);
    parent.appendTo(document.body);
    parent.remove();

    assert(child.inDOM() === false);
  });

  test('Should fire a \'remove\' event on each child view', function() {
    var callback = sinon.spy();
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);

    child.on('remove', callback);

    parent.appendTo(document.body);
    parent.remove();

    assert(callback.called, '\'remove\' event should have been fired on child');
  });

});