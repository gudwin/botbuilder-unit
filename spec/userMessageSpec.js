const botFactory = require('./lib/botFactory');
const botbuilder = require('botbuilder');
const unit = require('../');
let bot = null;

describe('Test UserMessages', function () {
  function botWithSuggestedActions() {
    bot.dialog('/test', [
      function (session) {
        let text = 'Hello world!';
        session.send(msg);
        session.endConversation();
      }
    ]);
  }

  beforeEach(()=> {
    bot = botFactory();
  });

  it('Test error caused by message from user will be handled', function (done) {
    let script = require('./scripts/UserMessage/errorInCallback');
    bot.dialog('/test', [
      function (session) {
        session.sendTyping();
        session.endDialog('Hello world!');
      }
    ]);
    unit(bot, script).then(() => {
      fail('Impossible case');
      done();
    }, (error) => {
      expect(error).toContain('Internal Failure');
      done();
    });
  });


})