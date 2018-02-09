const botFactory = require('./lib/botFactory');
const botbuilder = require('botbuilder');
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
    unit(bot, script, {
      title: 'Test typing'
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

    unit(bot, script, {
      title: 'Test endConversation'
    }).then(function () {
      done();
    });
  });
  it('Testing suggested actions', (done) => {
    let script = require('./scripts/service/suggestedActions');
    bot.dialog('/test', [
      function (session) {
        let text = 'Hello world!';
        var msg = new botbuilder.Message(session)
          .text(text)
          .suggestedActions(
            botbuilder.SuggestedActions.create(
              session, [
                botbuilder.CardAction.imBack(session, "add", "Add"),
                botbuilder.CardAction.imBack(session, "modules", "Modules"),
                botbuilder.CardAction.imBack(session, "test me", "Test me"),
                botbuilder.CardAction.imBack(session, "settings", "Settings")
              ]
            ));
        session.send(msg);
        session.endConversation();
      }
    ]);
    unit(bot, script, {
      title: 'Testing suggested actions'
    }).then(function () {
      done();
    });
  });
  it('Testing that bot error message contains information with differences about suggested actions', (done) => {
    let script = require('./scripts/service/suggestedActions');
    bot.dialog('/test', [
      function (session) {
        let text = 'Hello world!';
        var msg = new botbuilder.Message(session)
          .text(text)
          .suggestedActions(
            botbuilder.SuggestedActions.create(
              session, [
                botbuilder.CardAction.imBack(session, "add", "Add"),
                botbuilder.CardAction.imBack(session, "modules", "Modules"),
                botbuilder.CardAction.imBack(session, "hello", "Hello"),
                botbuilder.CardAction.imBack(session, "settings", "Settings")
              ]
            ));
        session.send(msg);
        session.endConversation();
      }
    ]);
    unit(bot, script, {
      title: 'Testing suggested actions'
    }).then( () => {
      fail('Impossible case');
      done();////
    }, (error) => {
      errorMsg = error.toString();

      expect(error.includes("hello")).toBe(true );
      expect(error.includes("test me")).toBe(true);
      done()
    });
  })
})