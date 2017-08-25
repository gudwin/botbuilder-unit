const botFactory = require('./botFactory');
const unit = require('../');

describe('Errors Test', function () {
  it('Will raise an error if messages do not match', function (done) {
    let bot = botFactory();
    let script = [
      {user: 'hi'},
      {bot: 'hi!'}
    ];

    bot.dialog('/test', [
      function (session) {
        session.endDialog('Hello world!')
      }
    ])


    unit(bot, script).then(function () {

    }, function (err ) {
      expect(err).toBe('[Error on step - 2]  <Hello world!> does not match <hi!>');
      done();
    });
  });
})