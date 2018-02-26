const unit = require('../../botbuilder-unit');
const builder = require('botbuilder');

let script = [
  {
    session: {
      userData: {
        name: 'Gisma'
      }
    }
  },
  {
    user: 'Hi'
  },
  {
    bot: 'Hello, Gisma!'
  },
  {
    session: {
      userData: {
        name: 'Yulia'
      }
    }
  },
  {
    user: 'Hi'
  },
  {
    bot: "Hello, Yulia!"
  }
];


bot = new builder.UniversalBot();
bot.dialog('/', [
  session => session.endDialog(`Hello, ${session.userData.name}!`)
]);

// Executing test
unit(bot, script, {
  title: 'Sample With Session Management',
  reporter : new unit.BeautyLogReporter() // Display log in messenger-like style, with colors
}).then(() => {
  // If test finished successfully
  console.log('Script passed');
  process.exit();
}, (err)  => {
  console.error(err);
})