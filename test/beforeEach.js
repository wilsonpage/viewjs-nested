
var assert = chai.assert;

beforeEach(function() {
  viewjs.Base.prototype.plugins = [];
  viewjs.plugin(window['viewjs-nested']);
});