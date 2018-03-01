const botFactory = require('./lib/botFactory');
const wrappers = require('./lib/jasmine-wrappers');

const botbuilder = require('botbuilder');
const unit = require('../');
let bot = null;

describe('Test service messages like typing, endconversation and etc', function () {
  function botWithSuggestedActions() {
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
  }
  beforeEach(()=> {
    bot = botFactory();
  });

  it('Test typing', function (done) {
    let script = require('./scripts/BotMessage/typing');
    bot.dialog('/test', [
      function (session) {
        session.sendTyping();
        session.endDialog('Hello world!');
      }
    ]);
    wrappers.successExpected(bot, script, done );
  });
  it('Test endConversation', (done) => {
    let script = require('./scripts/BotMessage/endConversation');
    bot.dialog('/test', [
      function (session) {
        session.endConversation('Hello world!');
      }
    ]);

    wrappers.successExpected(bot, script, done );
  });
  it('Testing suggested actions', (done) => {
    let script = require('./scripts/BotMessage/suggestedActions');
    botWithSuggestedActions();
    unit(bot, script, {
      title: 'Testing suggested actions'
    }).then(function () {
      done();
    });
  });
  it('Testing that bot error message contains information with differences about suggested actions', (done) => {
    botWithSuggestedActions();
    let script = require('./scripts/BotMessage/suggestActionContentDiffers');
    unit(bot, script, {
      title: 'Testing suggested actions'
    }).then( () => {
      fail('Impossible case');
      done();
    }, (error) => {
      errorMsg = error.toString();
      expect(error.includes("settings")).toBe(true );
      expect(error.includes("wrongmessage")).toBe(true);
      done()
    });
  })
  it('Test that error raised if there are no suggested actions in expected message', (done) => {
    bot.dialog('/test', [
      function (session) {
        let text = 'Hello world!';
        var msg = new botbuilder.Message(session)
          .text(text);
        session.send(msg);
        session.endConversation();
      }
    ]);
    let script = require('./scripts/BotMessage/emptySuggestedActions');
    unit(bot, script, {
      title: 'Testing suggested actions'
    }).then( () => {
      fail('Impossible case');
      done();
    }, (error) => {
      done()
    });
  });
  it('Test that error raised if count of received suggested actions differs from expected', (done) => {
    botWithSuggestedActions();
    let script = require('./scripts/BotMessage/suggestedActionsCountDiffers');
    unit(bot, script, {
      title: 'Testing suggested actions'
    }).then( () => {
      fail('Impossible case');
      done();
    }, (error) => {
      done()
    });
  });
  it('Verify that error message contain detailed information, in case, if titles of types of actions are different',(done) => {
    botWithSuggestedActions();

    let script = require('./scripts/BotMessage/suggestedActionsIssuesWithTitleAndType');
    unit(bot, script).then( () => {
      fail('Impossible case');
      done();
    }, (error) => {
      expect(error.toString()).toContain("Wrong type");
      expect(error.toString()).toContain("Expected title");
      done()
    });
  });
  it('Test that error will be sent if typing indicator will be missed by a bot', (done) => {
    bot = botFactory();
    let script = [{user: 'hi!'}, {typing: true}];
    bot.dialog('/test', (session) => {
      session.endDialog('not a typing')
    });
    unit(bot, script).then(() => {
      fail('Impossible case');
      expect(err.toString()).toContain('Typing indicator expected');
    }, done)
  })
  it('Test that error will be sent if endConversation item skipped', (done) => {
    bot = botFactory();
    let script = [{user: 'hi!'}, {endConversation: true}];
    bot.dialog('/test', (session) => {
      session.endDialog('not a typing')
    });
    unit(bot, script).then(() => {
      fail('Impossible case')
    }, (err) => {
      expect(err.toString()).toContain('endConversation indicator expected');
      done();
    });
  });

})