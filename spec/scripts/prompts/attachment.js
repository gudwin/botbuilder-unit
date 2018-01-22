const builder = require('botbuilder');
module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": "Please upload an attachment"
  },
  {
    "user": function ( ) {
      let msg = new builder.Message();
      msg.addAttachment({
        "name": "test",
        "contentType": "plain/text",
        "content": "Hello world"
      });

      return Promise.resolve(msg);
    }
  },
  {
    "bot": "Your response is:test:plain/text"
  }
];