const properties = require('./properties');
const values = require('./values');

module.exports = (opts) => {
  opts = opts || {};
  return {
    postcssPlugin: 'postcss-berndeutsch-stylesheets',
    Declaration(decl) {
      Object.keys(properties).forEach((property) => {
        if (decl.prop === properties[property]) {
          decl.prop = property;
        }
        if (decl.value.indexOf('!äuä') >= 0) {
          decl.value = decl.value.replace(/\s*!äuä\s*/, '');
          decl.important = true;
        }
      });

      Object.keys(values).forEach((val) => {
        const regex = new RegExp(`^${values[val]}$`);
        decl.value = decl.value.replace(regex, val);
      });
    }
  };
};
module.exports.postcss = true;
