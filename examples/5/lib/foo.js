define(function(require, exports, module) {
'use strict';

var View = require('appview');

module.exports = View.extend({
  name: 'foo',
  render: function() {
    var child = this.children[0];
    var html = this.children.map(function(child) {
      return child.el.outerHTML;
    });

    this.el.innerHTML = this.template({ child: html.join('') });
    return this;
  },
  template: function(data) {
    return '<h2>foo</h2><div>' + data.child + '</div>';
  }
});

});