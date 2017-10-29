const botFactory = require('./botFactory');
const unit = require('../');
describe('Before/After Test Suite', function () {
  it('Should support `before` and `after` attributes', function (done) {
    let bot = botFactory();
    let script = require('./scripts/beforeAfter');

    bot.dialog('/test', [
      function (session,args, next) {
        session.send('Hello, World!');
        next();
      },
      function ( session ) {
        session.endDialog('End of test dialog')
      }
    ])

    unit( bot, script ,{
      title : 'Should support `before` and `after` attributes'
    }).then( function () {
      done();
    });
  });
})