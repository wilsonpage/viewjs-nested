

suite('ViewNested()', function() {

	test('Should attach `nested` array onto view', function() {
		var Foo = view.define({});
		var foo = new Foo();
		assert(foo.nested);
	});

  test('Should accept `nested` views Array|Object as an option', function() {
    var Foo = view.define({ name: 'foo' });
    var Bar = view.define({ name: 'bar' });

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
    assert(foo2.nested.barId1 === bar1);
    assert(foo2.nested.barId2 === bar2);
  });

});