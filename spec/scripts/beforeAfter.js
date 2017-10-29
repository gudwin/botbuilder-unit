const targetMessage = {
  bot : ""
};
let result = [
  {
    "user": "hi",
    "after": function ( config, bot) {
      targetMessage.bot = "End of test dialog";
      return Promise.resolve();
    }
  },
  {
    "before": function ( config, bot) {
      this.bot = 'Hello, World!';
      return Promise.resolve();
    }
  },
  targetMessage
]
module.exports = result;