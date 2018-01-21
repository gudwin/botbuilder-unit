const botFactory = require('./lib/botFactory');
const unit = require('../');
describe('Basic Test Suite: text user/bot messages with user', function () {
  it('Should support `user` and `bot` attributes', function (done) {
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

    unit( bot, script, {
      title: 'Should support `user` and `bot` attributes'
    } ).then( function () {
      done();
    });
  });
})