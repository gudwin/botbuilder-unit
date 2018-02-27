const botFactory = require('./lib/botFactory');
const unit = require('../');

const botbuilder =require('botbuilder');

function addDefaultDialogs( bot ) {
  bot.dialog('/test', [
    function (session) {
      session.send('Test dialog welcomes you!')
      session.beginDialog('/testB');
    },
    function ( session ) {
      session.endDialog('End of test dialog')
    }
  ])
  bot.dialog('/testB', function (session) {
    session.endDialog('TestB wialog welcomes you!')
  });
}
describe('Basic Test Suite: text user/bot messages with user', function () {


  it('Should support `user` and `bot` attributes', function (done) {
    let bot = botFactory();
    let script = require('./scripts/base');
    addDefaultDialogs(bot);

    unit( bot, script, {
      title: 'Should support `user` and `bot` attributes'
    } ).then( function () {
      done();
    });
  });
  it('Test that connector added by default', (done) => {
    let bot = new botbuilder.UniversalBot();
    let script = require('./scripts/base');
    addDefaultDialogs(bot);

    bot.dialog('/', function (session) {
      session.beginDialog('/test');
    });

    unit( bot, script, {
      title: 'Test that connector added by defaul'
    } ).then( function () {
      done();
    });
  });
  it('Test that if any connector already used, testconnector will be not unit', (done) => {
    let bot = new botbuilder.UniversalBot(new botbuilder.ConsoleConnector());
    let script = require('./scripts/base');
    addDefaultDialogs(bot);

    bot.dialog('/', function (session) {
      session.beginDialog('/test');
    });

    unit( bot, script, {
      title: 'Test that connector added by defaul'
    } ).then( function () {
      console.log(bot);
      done();
    });
  })
})