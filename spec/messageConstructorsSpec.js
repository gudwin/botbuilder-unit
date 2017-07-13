const botFactory = require('./botFactory');
const unit = require('../');
const builder = require('botbuilder');
describe('Message Constructors Suite:', function () {
  it('Should support `in` and `out` attributes as message constructors', function (done) {
    let bot = botFactory();
    let script = require('./scripts/messageConstructors');

    bot.dialog('/test', [
      function (session) {
        builder.Prompts.text(session, 'Say hello?');
      },
      function ( session,results ) {
        session.endDialog(`You typed: ${results.response}`)
      }
    ])

    unit( bot, script).then( function () {
      done();
    });
  });
})