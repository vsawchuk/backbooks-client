const printer = require('../src/print');

describe('Print spec', () => {
  it('must return true', () => {
   expect(printer()).toBe(true);
  });
});
