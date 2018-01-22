const botFactory = require('./lib/botFactory');
const unit = require('../');

const builder= require('botbuilder');

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
    let script = require('./scripts/attachments/attachmentScript');
    unit(bot, script, {
      title: 'scripts/attachments/attachmentScript'
    }).then(function () {
      done();
    }, function ( ) {
      fail('Impossible case')
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


});