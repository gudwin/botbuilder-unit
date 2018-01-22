const unit = require('../../botbuilder-unit');
const builder = require('botbuilder');

let script = [
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
          "images": function ( value ) {
            return 2 == value.length ? Promise.resolve() : Promise.reject('Wrong images count');
          }
        }
      }
    ]
  },
  {endConversation: true}
];


let connector = new builder.ConsoleConnector().listen();
bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  function (session) {
    session.send('Hello');
    var msg = new builder.Message(session);
    msg.text('World!');
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
      new builder.HeroCard(session)
        .title("My Title")
        .subtitle("My Subtitle")
        .images([
          builder.CardImage.create(session, 'Some Url'),
          builder.CardImage.create(session, 'Another Url')])
    ]);
    session.send(msg);
    session.endConversation();
  }
]);

// Executing test
unit(bot, script, {
  title: 'Sample With Attachment Sanagement',
  reporter : new unit.BeautyLogReporter() // Display log in messenger-like style, with colors
}).then(() => {
  // If test finished successfully
  console.log('Script passed');
  process.exit();
}, (err)  => {
  // In case of any failure
  console.error(err);
})