const botFactory = require('./botFactory');
const unit = require('../');
describe('Basic Test Suite: text in/out messages with user', function () {
  it('Should support `in` and `out` attributes', function (done) {
    let bot = botFactory();
    let script = require('./scripts/base');

    bot.dialog('/test', [
      function (session) {
        session.send('Test dialog welcomes you!')
        session.beginDialog('/testB');
      },
      function ( session ) {
        session.endDialog('End of test dialog')
      }
    ])
    bot.dialog('/testB', function (session) {
      session.endDialog('TestB wialog welcomes you!')
    });

    unit( bot, script ).then( function () {
      done();
    });
  });
})