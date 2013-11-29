
var counter = 1;

/**
 * Base view class. Accepts
 * or creates a root element
 * which we template into.
 *
 * @constructor
 */
var View = function(options){
  options = options || {};

  this._id = this._id || counter++;
  this.el = options.el || this.el || document.createElement(this.tag);
  //this.el.className += this.className || '';
  this.els = {};

  this.initChildren();

  // Initialize our 'faux' constructor
  this.initialize.apply(this, arguments);
};

/**
 * Base view prototype,
 * mixed in event emitter.
 *
 * @type {Object}
 */
View.prototype = {
  tag: 'div',
  className: '',
  name: '',
  initialize: function(){
    console.log('initialized', this);
  },
  ready: function(){},
  render: function() {
    this.el.innerHTML = this.template();
    this.constructor.call(this);
  },

  initChildren: function() {
    if (!this.children) return;
    for (var slot in this.children) {
      var child = this.children[slot];
      var el = this.el.querySelector('#view-' + child._id);
      child.constructor.call(child, { el: el });
    }
  },

  template: function() { return ''; },
  toHTML: function() {
    var classes = this.name + ' ' + this.className;
    var id = 'view-' + this._id;
    return '<' + this.tag + ' class="' + classes + '" id="' + id + '">' + this.template() + '</' + this.tag + '>';
  }
};

/**
 * Extends the base view
 * class with the given
 * properties.
 *
 * @param  {Object} properties
 * @return {Function}
 */
View.extend = function(properties) {
  // The child class constructor
  // just calls the parent constructor
  var Extended = function(){
    View.apply(this, arguments);
  };

  // Base the Child prototype
  // on the View's prototype.
  var C = function(){};
  C.prototype = View.prototype;
  Extended.prototype = new C();
  Extended.prototype.constructor = Extended;

  // Mixin any given properties
  mixin(Extended.prototype, properties);

  return Extended;
};

function mixin(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
}