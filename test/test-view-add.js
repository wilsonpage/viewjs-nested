
suite('View#add()', function() {
	test('Should add view to the children array', function() {
		var Foo = view.define({});
		var parent = new Foo();
    var child = new Foo();

    parent.add(child);
		assert(parent.nested.indexOf(child) > -1);
	});

  test('Should add a reference by name to children array/object', function() {
    var Foo = view.define({ name: 'foo' });
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);
    assert(parent.nested.foo);
  });

  test('Should add a reference by slot if given', function() {
    var Foo = view.define({ name: 'foo' });
    var parent = new Foo();
    var child = new Foo();

    parent.add(child, 'slotname');
    assert(parent.nested.slotname);
  });

  test('Should add a reference to the parent view', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);
    assert(child.parent === parent);
  });
});