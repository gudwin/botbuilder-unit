const builder = require('botbuilder');
module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": "Please upload an attachment",
  },
  {
    "user": function (bot, done, reject) {
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
    "bot": "Your response is:test:plain/text"
  }
];