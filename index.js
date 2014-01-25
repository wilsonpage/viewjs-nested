umd(function(define) {
define(function(require, exports, module) {
'use strict';

/**
 * Locals
 */

var slice = [].slice;

module.exports = function (view, options) {
  view.nested = [];
  view.nested.names = {};
  view.nested.slots = {};

  // Reference originals
  view._render = view.render;
  view._remove = view.remove;
  view._destroy = view.destroy;
  view._fire = view.fire;

  view.root = view;
  if (options.slot) view.slot = options.slot;
  view.mixin(methods);

  // Add children passed in options.nested
  each(options.nested || [], view.add, view);
};

var methods = {
  fire: function(name) {
    var args = arguments;
    var parent = this.parent;

    // Fire on Self
    this._fire.apply(this, arguments);

    // Special cases:
    switch (name) {

      // When a view tree is inserted
      // or removed from the DOM, descendents
      // must fire event hooks too.
      case 'insert':
      case 'remove':
      case 'before insert':
      case 'before remove':
        return this.broadcast(name);

      // Shouldn't be propagated
      case 'add':
      case 'destroy':
      case 'before add':
        return;
    }

    // Then fire on parent
    if (parent) parent.fire.apply(parent, args);
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
        method: 'findReplaceElement',
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
    this.fire('before add', child, slot);
    this.nested.push(child);
    this.nested[child.name] = child;
    slot = child.slot || slot;

    // Name reference
    this.nested.names[child.name] = child;

    if (slot) {
      child.slot = slot;
      this.nested.slots[slot] = child;
    }

    child.parent = this;
    child.root = this.root;

    // Update the root on
    // all nested children
    if (child.nested) {
      child.deepCall({
        method: this.setRoot,
        args: [this.root],
        skipSelf: true
      });
    }

    this.fire('add', child, slot);
    return this;
  },

  remove: function(child) {

    // Always operate on self
    if (child) {
      child.remove();
      return;
    }

    var parent = this.parent;

    if (parent) {
      var index = parent.nested.indexOf(this);
      var nested = parent.nested;

      // Array element
      if (~index) {
        nested.splice(index, 1);
      }

      // Delete references
      delete nested.names[this.name];
      delete nested.slots[this.slot];
      delete this.parent;
    }

    // Update the root
    this.deepCall({
      method: this.setRoot,
      args: [this]
    });

    // Call original
    this._remove();
  },

  destroy: function() {
    this.deepCall({
      method: '_destroy',
      fromBottom: true,
      skipSelf: true,
      args: [{ noRemove: true }]
    });

    this._destroy();
  },

  deepCall: function(options) {
    var fromBottom = options.fromBottom;
    var skipSelf = options.skipSelf;
    var self = this;

    var method = typeof options.method === 'string'
      ? this[options.method]
      : options.method;

    function call() {
      method.apply(self, options.args);
    }

    // Clear to prevent skipping
    delete options.skipSelf;

    // Depending on whether
    if (!skipSelf && !fromBottom) call();
    this.nested.forEach(callOn('deepCall', [options]));
    if (!skipSelf && fromBottom) call();
  },

  setRoot: function(root) {
    this.root = root;
  },

  broadcast: function() {
    this.deepCall({
      method: '_fire',
      skipSelf: true,
      args: arguments
    });
  }
};

function callOn(method, args) {
  return function(obj) {
    method = (typeof method === 'string') ? obj[method] : method;
    if (method) return method.apply(obj, args);
  };
}

function each(ob, fn, ctx) {
  for (var key in ob) fn.call(ctx, ob[key], key);
}

});},'viewjs-nested');function umd(fn,n){
if(typeof define=='function')return fn(define);
if(typeof module=='object')return fn(function(c){c(require,exports,module);});
var m={exports:{}},r=function(n){return window[n];};fn(function(c){window[n]=c(r,m.exports,m)||m.exports;});}