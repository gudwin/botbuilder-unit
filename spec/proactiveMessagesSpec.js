const builder = require('botbuilder');
const botFactory = require('./lib/botFactory');
const unit = require('../');
describe('Timeout test suite', function () {
  let bot = null;

  let sendProactiveMessage = (address) => {
    var msg = new builder.Message().address(address);
    msg.text('hi!');
    msg.textLocale('en-US');
    bot.send(msg);
  }

  beforeEach((done) => {
    try {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
      bot = botFactory();
      bot.dialog('/test', [
        (session, args, next) => {
          session.endDialog('End of test dialog')
        }
      ])
    } catch (e) {
      fail(e);
    }
    done();
  });

  it('Test that proactive messages supported', (done) => {
    let script = [
      {bot: "hi!"},
      {user: "hi"},
      {bot: 'End of test dialog'}
    ]
    unit(bot, script, {
      timeout: 1000,
      title: 'Should support `timeout` field, will fail if timeout exceeded'
    })
      .then(done)
      .catch(done);
    sendProactiveMessage(unit.DEFAULT_ADDRESS);
  });

})