const builder = require('botbuilder');
module.exports = [
  {
    "out": "hi"
  },
  {
    "in": "Please upload an attachment",
  },
  {
    "out": function (bot, session, done) {
      let msg = new builder.Message().address(session.message.address);
      msg.addAttachment({
        "name": "test",
        "contentType": "plain/text",
        "content": "Hello world"
      });
      session.send(msg)
      done();
    }
  },
  {
    "in": "Your response is:test:plain/text"
  }
];