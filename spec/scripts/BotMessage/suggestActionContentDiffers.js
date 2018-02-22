const botbuilder = require('botbuilder');

module.exports = [
  {
    "user": "Hi"
  },
  {
    "bot": "Hello world!",
    "suggestedActions" : [
      botbuilder.CardAction.imBack(null, "add", "Add"),
      botbuilder.CardAction.imBack(null, "modules", "Modules"),
      botbuilder.CardAction.imBack(null, "hello", "Hello"),
      botbuilder.CardAction.imBack(null, "wrongmessage", "Settings")
    ]
  },
  {
    "endConversation" : true
  }
]