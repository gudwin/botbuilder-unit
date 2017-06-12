module.exports = [
  {
    "out": "hi"
  },
  {
    "before": function ( bot) {
      this.in = 'Hello, World!';
    },
    "after": function ( bot) {
      module.exports[2].in = "End of test dialog";
    }
  },
  {}
];