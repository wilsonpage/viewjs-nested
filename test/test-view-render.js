
suite('View#render()', function() {

  // Demo View class
  var Foo = View.extend({
    name: 'foo',
    render: function() {
      var child = this.children[0];
      var html = child && child.render().el.outerHTML || '';
      this.el.innerHTML = this.template(html);
      return this;
    },
    template: function(child) {
      return '<h2>foo</h2><div>' + child + '</div>';
    }
  });

	test('Should contain the child elements after a deep render', function() {
		View.prototype.plugins.push(ViewChildren);

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

  test('Should initiate the replacing of child element from the render root', function() {
    View.prototype.plugins.push(ViewChildren);

    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);

    var parentFn = sinon.spy(parent, 'findReplaceElement');
    var child1Fn = sinon.spy(child1, 'findReplaceElement');
    var child2Fn = sinon.spy(child2, 'findReplaceElement');

    // Render from layer 1
    parent.render();

    assert(parentFn.calledBefore(child1Fn), 'findReplaceElement should have been initiated from parent');
    assert(parentFn.calledBefore(child2Fn));
    assert(child2Fn.called);

    parentFn.reset();
    child1Fn.reset();
    child2Fn.reset();

    // Render from layer 2
    child1.render();

    assert(!parentFn.called);
    assert(child1Fn.called, 'replace child elements should have been initiated from child1');
    assert(child2Fn.calledAfter(child1Fn));

    parentFn.restore();
    child1Fn.restore();
    child2Fn.restore();
  });

});