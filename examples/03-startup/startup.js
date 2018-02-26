const unit = require('../../botbuilder-unit');
const builder = require('botbuilder');

let script = [
  {dialog: "/my-test",args : {name : 'Gisma'}},
  {user: "Hi"},
  {bot: 'Hello, Gisma!'},
  {bot: 'You triggered unreachable dialog!'},
  {args : {name : 'Julia'}},
  {user: "Hi"},
  {bot: 'Hello, Julia!'},
  {bot: 'You triggered unreachable dialog!'}
];

// Lets setup the bot
// 1. Create Connector
// 2. Create Bot instance
// 3. Setup index ("/") dialog
// 4. Setup "my-test" dialog, the dialog couldb't be reached from index dialog
bot = new builder.UniversalBot();
bot.dialog('/', [
  session => session.endDialog('Index Dialog')
]);
bot.dialog('/my-test', [
  (session,args) => {
    console.log(args);
    session.send(`Hello, ${args.name}!`)
    session.endDialog('You triggered unreachable dialog!');
  }
]);

// Executing test
unit(bot, script, {
  title: 'Sample With Startup Dialog Management',
  reporter : new unit.BeautyLogReporter() // Display log in messenger-like style, with colors
}).then(() => {
  // If test finished successfully
  console.log('Script passed');
  process.exit();
}, (err)  => {
  // In case of any failure
  console.error(err);
})