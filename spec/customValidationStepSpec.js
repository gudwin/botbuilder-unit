const botFactory = require('./lib/botFactory');
const unit = require('../');

describe('Test sugar proposed by the Library', function () {
  let bot = null;

  beforeEach(()=> {
    bot = botFactory();
    bot.dialog('/test', [
      function (session) {
        session.send('message #0');
        session.send('message #1');
        session.send('message #2');
        session.send('message #3');

        session.endConversation('message #4');
      }
    ]);
  });
  function itCallback(title, path) {
    return (done) => {
      let script = require(path);
      unit(bot, script, {
        title: title
      }).then(function () {
        done();
      });
    }
  }

  function myIt(title, path) {
    it(title, itCallback(title, path))
  }

  function fmyIt(title, path) {

  }

  it('Test custom step inside script', ( done ) => {
    let script = require('./scripts/custom/customStepScript.js');
    unit(bot, script, {
      title: 'Test custom step inside script'
    }).then(function () {
      done();
    });
  })
  it('Test that custom step MUST return a promise', ( done ) => {
    let script = require('./scripts/custom/notAPromiseScript.js');
    unit(bot, script, {
      title: 'Test custom step inside script'
    }).then(function () {
      fail('Impossible case')
    }, () => {
      done();
    });
  })
  it('Test that custom could failure whole script', ( done ) => {
    let script = require('./scripts/custom/customFailureScript');
    unit(bot, script, {
      title: 'Test that custom could failure whole script'
    }).then(function () {
      fail('Impossible case')
    }, () => {
      done();
    });
  })


});