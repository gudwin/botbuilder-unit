const botFactory = require('./lib/botFactory');
const wrappers = require('./lib/jasmine-wrappers');
const unit = require('../');
const attachmentScript = require('./scripts/attachments/attachmentScript');

const builder = require('botbuilder');

function getDefaultAttachmentScript() {
  return attachmentScript.slice(0);
}
describe('Test attachments validations', function () {
  let bot = null;

  beforeEach(()=> {
    bot = botFactory();
    bot.dialog('/test', [
      function (session) {
        session.send('Hello');
        var msg = new builder.Message(session);
        msg.text('World!');
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
          new builder.HeroCard(session)
            .title("My Title")
            .subtitle("My Subtitle")
            .images([
              builder.CardImage.create(session, 'Some Url'),
              builder.CardImage.create(session, 'Another Url')])
        ]);
        session.send(msg);
        session.endConversation();
      }
    ]);
  });


  it('Test compare objects', (done) => {
    let script = getDefaultAttachmentScript();
    unit(bot, script, {
      title: 'scripts/attachments/attachmentScript'
    }).then(function () {
      done();
    }, function (error) {
      fail(error);
      done
    });
  })
  it('Validate attachment by functions option 1', (done) => {
    let script = require('./scripts/attachments/validateAttachmentWithFunction_1');
    unit(bot, script, {
      title: 'scripts/attachments/validateAttachmentWithFunction_1'
    }).then(function () {
      done();
    }, () => {
      fail('Impossible case')
    });
  })
  it('Validate attachment by functions option 2', (done) => {
    let script = require('./scripts/attachments/validateAttachmentWithFunction_2');
    unit(bot, script, {
      title: 'scripts/attachments/validateAttachmentWithFunction_1'
    }).then(function () {
      done();
    }, () => {
      fail('Impossible case')
    });
  })
  it('test that error raised if there are no promise returned by callback', (done) => {
    let script = require('./scripts/attachments/validateThatPromiseReturned');
    unit(bot, script, {
      title: 'scripts/attachments/validateThatPromiseReturned'
    }).then(function () {
      fail('Impossible Case');
      done();
    }, function (error) {
      expect(error.toString()).toContain('Callback MUST return a Promise');
      done();
    });
  });
  it('test that errors raised by callbacks are handled', (done) => {
    let script = require('./scripts/attachments/promiseReturnsAnIssue');
    wrappers.errorExpected(bot, script, done, null, (error) => {
      expect(error.toString()).toContain('Not-a-error');
    })
  });
  it('array attachment validation test: verify that error will raise if expected message miss key array', (done) => {
    let script = [
      {user: 'hi'},
      {bot: 'Hello'},
      {
        "bot": "World!",
        "attachmentLayout": "carousel",
        "attachments": [{
          "content": [] // <-- error root cause
        }]
      }
    ];
    wrappers.errorExpected(bot, script, done, (error) => {
      expect(error.toString()).toContain('Array instance expected');
    });
  });
  it('attachment validation test: that corresponding error rendered if received message does not have a required object', (done) => {
    let script = [
      {user: 'hi'},
      {bot: 'Hello'},
      {
        "bot": "World!",
        "attachmentLayout": "carousel",
        "attachments": [{
          "content": {
            "title": {}// <-- error will happen here,
          }
        }]
      }
    ];
    wrappers.errorExpected(bot, script, done, (error) => {
      expect(error.toString()).toContain('Object instance expected');
    });
  });
  it('attachment validation test: error will raise, if received message does not have a required scalar value', (done) => {
    let script = [
      {user: 'hi'},
      {bot: 'Hello'},
      {
        "bot": "World!",
        "attachmentLayout": "carousel",
        "attachments": [{
          "content": 48 // <-- error will happen here,
        }]
      }
    ];
    wrappers.errorExpected(bot, script, done, (error) => {
      expect(error.toString()).toContain('Scalar value expected');
    });
  });
  it('attachment layout validation failed: Callback MUST return a promise', (done) => {
    let script = [
      {user: 'hi'},
      {bot: 'Hello'},
      {
        "bot": "World!",
        "attachmentLayout": function () {
          return ('Some Tricky Issue')
        }
      }
    ];
    wrappers.errorExpected(bot, script, done, (error) => {
      console.log(error);
      expect(error.toString()).toContain('Callback MUST return a promise');
      expect(error.toString()).toContain('Some Tricky Issue');
    });
  });

  it('attachment layout validation failed: Promise returned by Callback rejected.', (done) => {
    let script = [
      {user: 'hi'},
      {bot: 'Hello'},
      {
        "bot": "World!",
        "attachmentLayout": function () {
          return Promise.reject('Internal Issue')
        }
      }
    ];
    wrappers.errorExpected(bot, script, done, (error) => {
      expect(error.toString()).toContain('Promise returned by Callback rejected');
      expect(error.toString()).toContain('Internal Issue');
    });
  })
  it('attachment layout validation failed: Expected value != Received value', (done) => {
    let script = [
      {user: 'hi'},
      {bot: 'Hello'},
      {
        "bot": "World!",
        "attachmentLayout": 'UnknownLayout'
      }
    ];

    wrappers.errorExpected(bot, script, done, null, (error) => {
      expect(error.toString()).toContain('UnknownLayout');
      expect(error.toString()).toContain('Expected value != Received value');
    });
  })


});