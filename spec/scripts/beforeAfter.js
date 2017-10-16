let targetMessage = {};
let result = [
  {
    "user": "hi"
  },
  {
    "before": function ( config, bot) {
      this.bot = 'Hello, World!';
      return Promise.resolve();
    },
    "after": function ( config, bot) {
      targetMessage.bot = "End of test dialog";
      return Promise.resolve();
    }
  },
  targetMessage
]
module.exports = result;