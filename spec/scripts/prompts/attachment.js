const builder = require('botbuilder');
module.exports = [
  {
    "out": "hi"
  },
  {
    "in": "Please upload an attachment",
  },
  {
    "out": function (bot, done, reject) {
      let msg = new builder.Message();
      msg.addAttachment({
        "name": "test",
        "contentType": "plain/text",
        "content": "Hello world"
      });

      done(msg);
    }
  },
  {
    "in": "Your response is:test:plain/text"
  }
];