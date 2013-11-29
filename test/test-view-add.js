

suite('View#add()', function() {

	test('Should add view to the children array', function() {
		View.prototype.plugins.push(ViewChildren);

		var Foo = View.extend({});
		var parent = new Foo();
    var child = new Foo();

    parent.add(child);

		assert(parent.children.indexOf(child) > -1);
	});

  test('Should add a reference by name to children array/object', function() {
    View.prototype.plugins.push(ViewChildren);

    var Foo = View.extend({ name: 'foo' });
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);

    assert(parent.children.foo);
  });

  test('Should add a reference by slot if given', function() {
    View.prototype.plugins.push(ViewChildren);

    var Foo = View.extend({ name: 'foo' });
    var parent = new Foo();
    var child = new Foo();

    parent.add(child, 'slotname');

    assert(parent.children.slotname);
  });

  test('Should add a reference to the parent view', function() {
    View.prototype.plugins.push(ViewChildren);

    var Foo = View.extend({});
    var parent = new Foo();
    var child = new Foo();

    parent.add(child);

    assert(child.parent === parent);
  });
});