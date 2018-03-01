const detectReporter = require('../src/detectReporter');
const unit = require('../');
describe('Test detectReporter module',() => {
  it('Should return Reporter by their key',(done) => {
    expect(detectReporter('beauty') instanceof unit.BeautyLogReporter).toBe(true);
    expect(detectReporter('plain') instanceof unit.PlainLogReporter).toBe(true);
    expect(detectReporter('empty') instanceof unit.EmptyLogReporter).toBe(true);
    done();
  });
})