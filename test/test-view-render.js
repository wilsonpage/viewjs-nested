
suite('View#render()', function() {

  // Demo View class
  var Foo = viewjs.define({
    name: 'foo',
    render: function() {
      var child = this.nested[0];
      var html = child && child.render().placeholder() || '';
      this.el.innerHTML = this.template(html);
      return this;
    },
    template: function(child) {
      return '<h2>foo</h2><div>' + child + '</div>';
    }
  });

	test('Should contain the child elements after a deep render', function() {
		var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);
    parent.render();

    var child1El = parent.el.querySelector('#' + child1.el.id);
    var child2El = parent.el.querySelector('#' + child2.el.id);

    assert(child1El === child1.el);
		assert(child2El === child2.el);
	});
});