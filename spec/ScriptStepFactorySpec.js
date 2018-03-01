const ScriptStepFactory = require("../src/ScriptStepFactory");
describe("Test Suite for ScriptStepFactorySpec", function () {
  it("Test exception throw for unknown steps", done => {
    try {
      ScriptStepFactory(0, {unknown: true}, null, null, null);
    } catch (e) {
      expect(e.message).toBe('Unsupported config - {"unknown":true}');
      done();
    }
  });
});
