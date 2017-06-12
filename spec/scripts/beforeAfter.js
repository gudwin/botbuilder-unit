module.exports = [
  {
    "out": "hi"
  },
  {
    "before": function ( bot,done) {
      this.in = 'Hello, World!';
      done();
    },
    "after": function ( bot, done) {
      module.exports[2].in = "End of test dialog";
      done();
    }
  },
  {}
];