const postcss = require('postcss');
const plugin = require('../src/index');
const properties = require('../src/properties');
const values = require('../src/values');

function run(input, output, opts, done) {
  return postcss([plugin(opts)])
    .process(input)
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toEqual(0);
      done();
    })
    .catch((error) => {
      done(error);
    });
}

function propertyTest(german, english, value = 'german') {
  it(`converts property ${german} to ${english}`, (done) => {
    run(
      `a{ ${german}: ${value}; }`,
      `a{ ${english}: ${value}; }`,
      { from: undefined },
      done
    );
  });
}

function valueTest(german, english, property = 'german') {
  it(`converts value ${german} to ${english}`, (done) => {
    run(
      `a{ ${property}: ${german}; }`,
      `a{ ${property}: ${english}; }`,
      { from: undefined },
      done
    );
  });
}

function hasNoDuplicateValue(obj) {
  const valueSet = {}; // Create an empty object to store encountered values

  for (const key in obj) {
    const value = obj[key];

    if (valueSet[value]) {
      // Value is already in the set, indicating a duplicate
      console.error(value);
      return false;
    }

    // Store the value in the set
    valueSet[value] = true;
  }

  // If the loop completes without finding duplicates, return false
  return true;
}

describe('postcss-berndeutsch-stylesheets', () => {
  // Check for Property duplicates
  it('check if properties contains any duplicate value', (done) => {
    expect(hasNoDuplicateValue(properties)).toBe(true);
    done();
  });

  it('check if values contains any duplicate value', (done) => {
    expect(hasNoDuplicateValue(values)).toBe(true);
    done();
  });

  // Test Properties
  Object.keys(properties).forEach((property) =>
    propertyTest(properties[property], property)
  );

  // Test Values
  Object.keys(values).forEach((value) => valueTest(values[value], value));

  // Test important
  it('converts !äuä to !important', (done) => {
    run(
      'a{ color: white !äuä; }',
      'a{ color: white !important; }',
      { from: undefined },
      done
    );
  });
});
