
suite('View#broadcast()', function() {

	test('Should fire event on all decendents', function() {
    View.prototype.plugins.push(ViewChildren);

    var callback = sinon.spy();
    var Foo = View.extend({});
    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);

    parent.on('test', callback);
    child1.on('test', callback);
    child2.on('test', callback);
    parent.broadcast('test');

    assert(callback.calledThrice);
  });

});