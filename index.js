(function() {
'use strict';

/**
 * Locals
 */

var slice = [].slice;


function plugin(view) {
  view.children = [];

  // Reference originals
  view._render = view.render;
  view._remove = view.remove;
  view._destroy = view.destroy;
  view._fire = view.fire;

  // Add new methods
  view.fire = methods.bubbleFire;
  view.broadcast = methods.broadcast;
  view.findReplaceElement = methods.findReplaceElement;
  view.render = methods.render;
  view.remove = methods.remove;
  view.destroy = methods.destroy;
  view.add = methods.add;
  view.deepCall = methods.deepCall;
}


var methods = {
  bubbleFire: function(name) {
    var args = arguments;
    var parent = this.parent;

    // Fire on Self
    this._fire.apply(this, arguments);

    // Don't propagate
    // 'core' events
    switch (name) {
      case 'before initialize':
      case 'initialize':
      case 'destroy':
      case 'remove':
      case 'inserted':
        return;
    }

    // Then fire on parent
    if (parent) {
      parent.fire.apply(parent, args);
    }
  },

  render: function() {
    var isRenderRoot = (!this.parent || !this.parent.rendering);
    var returnValue;

    this.rendering = true;
    returnValue = this._render();
    this.rendering = false;

    // Once the render call has completed
    // we must replace the child view nodes
    // with the original child.el nodes.
    // This must be run from the root callee
    // and recurse from the top down.
    if (isRenderRoot) {
      this.deepCall({
        fn: 'findReplaceElement',
        args: [this.el]
      });
    }

    // Be sure the return what
    // the original returned.
    return returnValue;
  },

  findReplaceElement: function(root) {
    var id = this.el.id;
    var el = root.querySelector('#' + id);

    // Replace the placeholder element
    // with the cononical view element.
    if (el) el.parentNode.replaceChild(this.el, el);
  },

  add: function(child, slot) {
    this.children.push(child);
    this.children[child.name] = child;

    if (slot) {
      child.slot = slot;
      this.children[slot] = child;
    }

    child.parent = this;
  },

  remove: function(child) {

    // Always operate on self
    if (child) {
      child.remove();
      return;
    }

    var parent = this.parent;

    if (parent) {
      var index = parent.children.indexOf(this);
      var nameRef = parent.children[this.name];
      var slotRef = parent.children[this.slot];
      var children = parent.children;

      // Array element
      if (~index) {
        children.splice(index, 1);
      }

      // Name reference
      if (nameRef && nameRef === this) {
        delete children[this.name];
      }

      // Slot reference
      if (slotRef && slotRef === this) {
        delete children[this.slot];
      }

      // Parent reference
      delete this.parent;
    }

    // Call original
    this._remove({ silent: true });
    this.broadcast('remove');
  },

  destroy: function() {
    this.deepCall({
      fn: '_destroy',
      fromBottom: true,
      skipSelf: true,
      args: [{ noRemove: true }]
    });

    this._destroy();
  },

  deepCall: function(options) {
    var fn = this[options.fn];
    var fromBottom = options.fromBottom;
    var skipSelf = options.skipSelf;
    var self = this;

    function call() {
      fn.apply(self, options.args);
    }

    // Clear to prevent skipping
    delete options.skipSelf;

    // Depending on whether
    if (!skipSelf && !fromBottom) call();
    this.children.forEach(callOn('deepCall', [options]));
    if (!skipSelf && fromBottom) call();
  },

  broadcast: function() {
    this.deepCall({
      fn: '_fire',
      args: arguments
    });
  }
};

function callOn(fn, args) {
  return function(obj) {
    fn = (typeof fn === 'string') ? obj[fn] : fn;
    return fn.apply(obj, args);
  };
}

/**
 * Expose 'ViewChildren' (UMD)
 */

if (typeof exports === 'object') {
  module.exports = plugin;
} else if (typeof define === 'function' && define.amd) {
  define(function(){ return plugin; });
} else {
  window['ViewChildren'] = plugin;
}

})();