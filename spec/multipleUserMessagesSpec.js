const botFactory = require('./botFactory');
const unit = require('../');
describe('Multiple User Message: test that multiple messages from users support', function () {
  it('Should support double `user` messages', function (done) {
    let bot = botFactory();
    let script = require('./scripts/multipleUserMessages');

    bot.dialog('/test', [
      function (session) {
        if ( session.message.text != 'Hi!') {
          session.endDialog();
        } else {
          session.endDialog('Hello world!');
        }
      }
    ])

    unit( bot, script,{
      title : 'Should support double `user` messages'
    } ).then( function () {
      done();
    });
  });
})