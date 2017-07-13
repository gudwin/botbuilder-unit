module.exports = [
  {
    "user": "hi"
  },
  {
    "before": function ( bot) {
      this.bot = 'Hello, World!';
    },
    "after": function ( bot) {
      module.exports[2].bot = "End of test dialog";
    }
  },
  {}
];