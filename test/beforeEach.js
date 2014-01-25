
var assert = chai.assert;

beforeEach(function() {
  view.Base.prototype.plugins = [];
  view.plugin(window['viewjs-nested']);
});