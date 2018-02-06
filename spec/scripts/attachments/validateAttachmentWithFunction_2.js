module.exports = [
  {user: 'hi'},
  {bot: 'Hello'},
  {
    "bot": "World!",
    "attachmentLayout": 'carousel',
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.hero",
        "content": function (value) {
          let result = ((value.title == 'My Title')
          && (value.subtitle == 'My Subtitle')
          && (value.images.length == 2));
          return result ? Promise.resolve() : Promise.reject();
        }
      }
    ]
  },
  {endConversation: true}
]