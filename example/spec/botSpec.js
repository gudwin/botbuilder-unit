const unit = require('../../botbuilder-unit');
const builder = require('botbuilder');

describe('Simple test for a bot', () => {
  let bot = null;
  beforeEach( () => {
    let connector = new builder.ConsoleConnector().listen();
    bot = new builder.UniversalBot(connector);
    bot.dialog('/', [
      session => builder.Prompts.text(session,'How should I call you?'),
      (session, response) => session.endDialog(`Nice to meet you, ${JSON.stringify(response.response)}!`)
    ]);
  });
  it('Test welcome flow', (done) => {
    let messages = require('./hiScript');
    unit(bot,messages,done)
  });
});