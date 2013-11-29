

suite('Stuff()', function() {

	test('Should attach new properties onto views', function() {
		View.prototype.plugins.push(ViewChildren);

		var Foo = View.extend({});
		var foo = new Foo();

		assert(foo.children);
	});

});