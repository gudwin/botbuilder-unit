const botFactory = require('./botFactory');
const unit = require('../');
let bot = null;

describe('Test service messages like typing, endconversation and etc', function () {
  beforeEach(()=> {
    bot = botFactory();
  });
  it('Test typing', function (done) {
    let script = require('./scripts/service/typing');
    bot.dialog('/test', [
      function (session) {
        session.sendTyping();
        session.endDialog('Hello world!');
      }
    ]);
    unit(bot, script,{
      title : 'Test typing'
    }).then(function () {
      done();
    });
  });
  it('Test endConversation', (done) => {
    let script = require('./scripts/service/endConversation');
    bot.dialog('/test', [
      function (session) {
        session.endConversation('Hello world!');
      }
    ]);

    unit(bot, script,{
      title : 'Test endConversation'
    }).then(function () {
      done();
    });
  });
})