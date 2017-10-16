

"use strict";

const FINISH_TIMEOUT = 20;
const NEXT_USER_MESSAGE_TIMEOUT = 20;
const DEFAULT_TEST_TIMEOUT = 10000;

const MessageFactory = require('./src/MessageFactory');

function testBot(bot, messages, options) {
  options = Object.assign({timeout: DEFAULT_TEST_TIMEOUT}, options);
  messages = messages.slice(0);

  function callTrigger(check, bot, name, args) {
    if ("function" == typeof check[name]) {
      check[name](bot, args);
    }
  }

  return new Promise(function (resolve, reject) {
    var step = 0;
    var connector = bot.connector('console');

    function done() {
      resolve();
    }

    function fail(err) {
      reject(err);
    }

    function checkBotMessage(message, check, doneCallback) {
      MessageFactory.factory(check, bot, _d('log'))
        .validate( message )
        .then(() => {
          doneCallback();
        })
      .catch((err) => {
        doneCallback( err );
      });
    }

    function next() {
      if (!messages.length) {
        _d('log')('SCRIPT FINISHED');
        setTimeout(done, FINISH_TIMEOUT); // Enable message from connector to appear in current test suite
        return;
      }

      if (messages[0].user) {
        let messageConfig = messages.shift();
        _d('log')(`Step: #${step}`);
        step++;

        MessageFactory.factory(messageConfig, bot, _d('log'))
          .send(messageConfig)
          .then(function () {
            if (messages.length && (messages[0].user)) {
              setTimeout(function () {
                next();
              }, NEXT_USER_MESSAGE_TIMEOUT)
            }
          })
          .catch(function (err) {
            fail(err)
          });
      }

    }

    function outputScript() {
      let intro = '';
      messages.forEach((item, i) => {
        item = Object.assign({}, item);
        for ( var key in item ) {
          if ( item.hasOwnProperty(key) && ("function" == typeof (item[key]))) {
            item[key] = '[[Function]]';
          }
        }
        intro = intro + (`${i}: ${JSON.stringify(item)}\n`);
      });
      _d('log')(intro);
    }

    function startTesting() {
      if (messages.length) {
        outputScript();
        next();
      }
    }

    function setupTimeout() {
      if (options.timeout) {
        setTimeout(() => {
          reject(`Default timeout (${options.timeout}) exceeded`);
        }, options.timeout);
      }
    }

    function setupReplyReceiver() {
      bot.on('send', function (message) {
        _d('log')(`Step: #${step}\nReceived message from bot:`);

        if (messages.length) {
          var check = messages.shift();
          _d('log')(check);
          _d('log')('--');
          step++;
          callTrigger(check, bot, 'before', message);
          checkBotMessage(message, check, (err) => {
            callTrigger(check, bot, 'after', err);
            if (err) {
              fail(err);
            } else {
              next();
            }
          });
        }
        else {
          _d('log')('Bot: >>Ignoring message (Out of Range)');
          setTimeout(done, FINISH_TIMEOUT); // Enable message from connector to appear in current test suite
        }
      });
    }

    setupTimeout();
    setupReplyReceiver();
    startTesting();
  })
}

testBot.dependencies = {
  log: console.log
}
function _d(name) {
  return testBot.dependencies[name];

}

module.exports = testBot;