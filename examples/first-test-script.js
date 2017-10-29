const unit = require('../../botbuilder-unit');
const builder = require('botbuilder');

let script = [
  {
    "user": "hi"
  },
  {
    "bot": "How should I call you?"
  },
  {
    "user": "Timmy"
  },
  {
    "bot": "Nice to meet you, \"Timmy\"!"
  }
];

let connector = new builder.ConsoleConnector().listen();
bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  session => builder.Prompts.text(session, 'How should I call you?'),
  (session, response) => session.endDialog(`Nice to meet you, ${JSON.stringify(response.response)}!`)
]);
unit(bot, script, {
  title: 'Your first test script'
}).then(() => {
  console.log('Script passed');
  process.exit(); // bot create console connector
}, (err)  => {
  console.error(err);
})
