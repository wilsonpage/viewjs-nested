
suite('View#broadcast()', function() {

  test('Should fire event on all decendents', function() {
    var callback = sinon.spy();
    var Foo = viewjs.define({});
    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);

    parent.on('test', callback);
    child1.on('test', callback);
    child2.on('test', callback);
    parent.broadcast('test');

    assert(callback.calledTwice, 'callback not called 3 times');
  });

});