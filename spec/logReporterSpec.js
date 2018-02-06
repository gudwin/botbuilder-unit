let unit = require('../');

describe('Smoke tests for log reporter', function() {
  let testReporter = ( logger ) => {
    let script = [
      {user: 'Hi'},
      {bot: 'Hello, Gisma!'},
      {user: 'What do we have for today?'},
      {bot: 'Plans for today:'},
      {bot: '- fir reporting in concur'},
      {bot: '- update botbuilder-unit'},
      {bot: '- preparare report about annotator problem'},
      {bot: '- read Bacardi docs'},
      {user: 'Got that, than I have to say that we are changing plans! We have to switch to Drupal Open Day first, and then close concur issue'},
      {bot: 'Well, I have to say that even a superlong conversation is a not big problem for me. So go on, please proceed with future requiests'},
      {endConversation: true},
      {bot: 'Of I forgot to mention'},
      {bot: /^for how long/ }

    ]
    try {
      logger.newScript(script);
      logger.messageSent(0, script[0])
      logger.messageReceived(1, script[1]);
      logger.messageSent(2, script[2]);
      logger.messageReceived(3, script[3]);
      logger.messageReceived(4, script[4]);
      logger.messageReceived(5, script[5]);
      logger.messageReceived(6, script[6]);
      logger.messageReceived(7, script[7]);
      logger.messageSent(8, script[8]);
      logger.messageReceived(9, script[9]);
      logger.endConversation(10);
      logger.scriptFinished(12);
      logger.error('ERROR ON STEP 11', {customError: 'Oh, well! I just happenned...'});
      logger.expectationError(11, {bot: 'I want to add...'}, script[11]);
      logger.warning('WARNING ON STEP 12', 'Some important information to notice!');

      logger.info('INFO AT STEP 14', {a:1,b:2,text: 'Oh, well! I just happenned...'})
      logger.startupDialog(14, '/startup/',{a:1,b:2,text: 'Oh, well! I just happenned...'});
      logger.session(15, {
        conversationData : {
          a : 'b'
        },
        userData : {
          c : 'd'
        },
        privateConversationData : {
          x : 'y'
        },
        sessionState : 1
      })
      logger.scriptFinished();
    } catch (e) {
      fail(e);
    }

  }
  it('Test Plain Log Reporter', (done) => {
    testReporter(new unit.PlainLogReporter());
    done();
  });
  it('Test Empty Log Reporter', (done) => {
    testReporter(new unit.EmptyLogReporter());
    done();
  })
  it('Test Beauty Log Reporter', (done) => {
    testReporter(new unit.BeautyLogReporter());
    done();
  })
})