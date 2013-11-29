
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


  this.el = options.el || this.el || document.createElement(this.tag);
  this.el.id = this.el.id || ('view' + counter++);
  //this.el.className += this.className || '';
  this.els = {};

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
    //console.log('initialized', this);
  },
  template: function() { return ''; },
  html: function() {
    return this.el.outerHTML;
  },
  appendTo: function(parent) {
    parent.appendChild(this.el);
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