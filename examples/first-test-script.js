const unit = require('../botbuilder-unit');
const builder = require('botbuilder');

// This array, also called a script. It will be used to validate conversation with user
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

// Setting up a bot
let connector = new builder.ConsoleConnector().listen();
bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  session => builder.Prompts.text(session, 'How should I call you?'),
  (session, response) => session.endDialog(`Nice to meet you, ${JSON.stringify(response.response)}!`)
]);

// Executing test
unit(bot, script, {
  title: 'Your first test script',
  reporter : new unit.BeautyLogReporter() // Display log in messenger-like style, with colors
}).then(() => {
  // If test finished successfully
  console.log('Script passed');
  process.exit();
}, (err)  => {
  console.error(err);
})