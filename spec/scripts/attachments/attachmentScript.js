module.exports = [
  {user : 'hi'},
  {bot : 'Hello'},
  {
    "bot" : "World!",
    "attachmentLayout": "carousel",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.hero",
        "content": {
          "title": "My Title",
          "subtitle": "My Subtitle",
          "images": [
            {
              "url": "Some Url"
            },
            {
              "url": "Another Url"
            }
          ]
        }
      }
    ]
  },
  {endConversation: true}
]