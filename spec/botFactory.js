const builder = require('botbuilder');

module.exports = function () {
  let connector = new builder.ConsoleConnector().listen();
  let bot = new builder.UniversalBot(connector);
  bot.connector('console', connector);

  bot.dialog('/', function (session) {
    session.beginDialog('/test');
  })
  return bot;
}