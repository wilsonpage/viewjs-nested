

suite('ViewNested()', function() {

	test('Should attach `nested` array onto view', function() {
		var Foo = viewjs.define({});
		var foo = new Foo();
		assert(foo.nested);
	});

  test('Should accept `nested` views Array|Object as an option', function() {
    var Foo = viewjs.define({ name: 'foo' });
    var Bar = viewjs.define({ name: 'bar' });

    var foo1 = new Foo({
      nested: [
        new Bar(),
        new Bar()
      ]
    });

    assert(foo1.nested.length === 2);

    var bar1 = new Bar();
    var bar2 = new Bar();
    var foo2 = new Foo({
      nested: {
        barId1: bar1,
        barId2: bar2,
      }
    });

    assert(foo2.nested.length === 2);
    assert(foo2.nested.slots.barId1 === bar1);
    assert(foo2.nested.slots.barId2 === bar2);
  });

  test('Should accept a space separated list of element ids', function() {
    var Foo = viewjs.define({ name: 'foo' });
    var Bar = viewjs.define({ name: 'bar' });
    var foo = new Foo({ nested: 'view3 view3' });
  });

});