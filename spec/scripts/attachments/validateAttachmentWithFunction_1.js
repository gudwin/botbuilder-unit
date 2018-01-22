module.exports = [
  {user : 'hi'},
  {bot : 'Hello'},
  {
    "bot" : "World!",
    "attachmentLayout": function ( value ) {
      return "carousel" == value ? Promise.resolve() : Promise.reject();
    },
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.hero",
        "content": {
          "title": function ( value ) {
            return "My Title" == value ? Promise.resolve() : Promise.reject('Wrong title');
          },
          "subtitle": function (value ) {
            return "My Subtitle" == value ? Promise.resolve() : Promise.reject('Wrong subtitle');
          },
          "images": function ( value ) {
            return 2 == value.length ? Promise.resolve() : Promise.reject('Wrong images count');
          }
        }
      }
    ]
  },
  {endConversation: true}
]