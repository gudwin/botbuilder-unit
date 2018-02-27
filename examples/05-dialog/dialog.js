const unit = require('../../botbuilder-unit');
const builder = require('botbuilder');
const script = require('./script');

bot = new builder.UniversalBot();
bot.dialog('/', [
  function (session) {
    builder.Prompts.text(session, 'How should I call you?');
  },
  function (session,response) {
    session.dialogData.userName = response.response;
    builder.Prompts.confirm(session, `Should I call you "${response.response}"?`, {
      listStyle: builder.ListStyle.button
    });
  },
  function (session, response) {
    if (!response.response) {
      session.send('Ok, than again :)');
      session.replaceDialog('/');
    } else {
      session.send(`Hello, ${session.dialogData.userName}!`)
      session.send(`I'm ready`);
    }
  }
]);

// Executing test
unit(bot, script, {
  title: 'Testing dialog',
  reporter: new unit.BeautyLogReporter() // Display log in messenger-like style, with colors
}).then(() => {
  console.log('Completed');
}, (err)  => {
  // In case of any failure
  console.error('Internal failure happened');
  console.error(err);
})