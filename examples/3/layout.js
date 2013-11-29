
function Layout(json) {
  return new Layer(json);
}


function Layer(json) {
  var children = json.children;
  var layer;
  var child;
  var slot;

  var view = this.view = new Views[json.module](json);

  this.layers = [];

  for (slot in children) {
    child = children[slot];
    layer = new Layer(child);

    this.layers[slot] = layer;
    this.layers.push(layer);
    layer.parent = this;
    layer.slot = slot;
  }
}

Layer.prototype = {

  render: function() {
    this.renderAll();
    this.initChildren();
    return this;
  },

  renderAll: function() {
    var children = {};

    this.layers.forEach(function(layer) {
      children[child.slot] = layer.view;
      layer.renderAll();
    });

    this.view.render(children);

    return this;
  },

  initChildren: function() {
    var root = this.view.el;

    this.layers.forEach(function(layer) {
      var id = layer.view.el.id;
      var el = root.querySelector('#' + id);
      layer.view.constructor.call(layer.view, { el: el });
    });
  },

  appendTo: function(parent) {
    this.view.appendTo(parent);
  },

  deepCall: function(method) {
    this.layers.forEach(function(layer) {
      if (layer[method]) layer[method]();
    });

    if (this[method]) this[method]();
  },

  // Fires an event on every child
  broadcast: function() {},

  // Replaces the normal fire
  // with a bubbling fire
  fire: function() {},
};