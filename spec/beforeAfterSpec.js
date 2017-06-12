const botFactory = require('./botFactory');
const unit = require('../');
fdescribe('Before/After Test Suite', function () {
  it('Should support `before` and `after` attributes', function (done) {
    let bot = botFactory();
    let script = require('./scripts/beforeAfter');

    bot.dialog('/test', [
      function (session) {
        session.send('Hello, World!');
      },
      function ( session ) {
        session.endDialog('End of test dialog')
      }
    ])

    unit( bot, script, done );
  });
})