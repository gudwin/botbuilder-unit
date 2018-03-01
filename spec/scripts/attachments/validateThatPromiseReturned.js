module.exports = [
  {user : 'hi'},
  {bot : 'Hello'},
  {
    "bot" : "World!",
    "attachmentLayout": "carousel",
    "attachments": () => {
      return false;
    }
  },
  {endConversation: true}
]