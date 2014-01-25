
suite('view.root', function() {

  test('Should initially be set to self', function() {
    var Foo = view.define({});
    var foo = new Foo();
    assert(foo.root === foo);
  });

  test('Should equal the root view', function() {
    var Foo = view.define({});
    var parent = new Foo();
    var child1 = new Foo();
    var child2 = new Foo();

    child1.add(child2);
    parent.add(child1);

    assert(child1.root === parent);
    assert(child2.root === parent);
    assert(child2.root === parent);
  });

  test('Should be a reference to self if self *is* the root', function() {
    var Foo = view.define({});
    var foo = new Foo();

    assert(foo.root === foo);
  });

  test('Should update the root for all descendents when a tree is added', function() {
    var Parent = view.define({ name: 'parent' });
    var Child = view.define({ name: 'child' });
    var parent1 = new Parent();
    var parent2 = new Parent();
    var child1 = new Child();
    var child2 = new Child();

    child1.add(child2);
    parent2.add(child1);

    assert(child2.root === parent2, '');
    assert(child1.root === parent2);
    assert(parent2.root === parent2);

    parent1.add(parent2);

    assert(child2.root === parent1);
    assert(child1.root === parent1);
    assert(parent2.root === parent1);
    assert(parent1.root === parent1);
  });

  test('Should update the root for all descendents when a tree is removed', function() {
    var Parent = view.define({ name: 'parent' });
    var Child = view.define({ name: 'child' });
    var parent1 = new Parent();
    var parent2 = new Parent();
    var child1 = new Child();
    var child2 = new Child();

    parent1.add(parent2);
    parent2.add(child1);
    child1.add(child2);

    assert(child2.root === parent1);
    assert(child1.root === parent1);
    assert(parent2.root === parent1);

    parent2.remove();

    assert(child2.root === parent2);
    assert(child1.root === parent2);
    assert(parent2.root === parent2);
    assert(parent1.root === parent1);
  });

});