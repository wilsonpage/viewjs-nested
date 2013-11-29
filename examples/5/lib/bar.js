define(function(require, exports, module) {
'use strict';

var View = require('appview');

module.exports = View.extend({
  name: 'bar',
  callbacks: {
    initialize: function(){},
    ready: function() {},
    inserted: function() {},
    removed: function() {}
  },
  render: function() {
    this.el.innerHTML = this.template();
  },
  template: function() {
    return '<h2>bar</h2>';
  }
});

});