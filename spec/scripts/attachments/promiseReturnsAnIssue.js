module.exports = [
  {user : 'hi'},
  {bot : 'Hello'},
  {
    "bot" : "World!",
    "attachmentLayout": "carousel",
    "attachments": function () {
      return Promise.reject('Not-a-error');
    }
  },
  {endConversation: true}
]