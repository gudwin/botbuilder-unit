"use strict";

const FINISH_TIMEOUT = 20;
const NEXT_USER_MESSAGE_TIMEOUT = 20;
const DEFAULT_TEST_TIMEOUT = 10000;


function testBot(bot, messages, options ) {
  options = Object.assign({timeout : DEFAULT_TEST_TIMEOUT }, options );

  function callTrigger(check, bot, name, args) {
    if ("function" == typeof check[name]) {
      check[name](bot, args);
    }
  }

  return new Promise(function (resolve, reject) {
    var step = 0;
    var connector = bot.connector('console');
    function done () {
      resolve();
    };
    function fail ( err ) {
      reject( err );
    }

    function checkBotMessage(message, check, callback) {

      if ( check.bot ) {
        if ( message.text ) {
          _d('log')(`BOT: >> ${(message.text)}`);
        } else {
          _d('log')(`BOT: >> ${JSON.stringify(message)}`);
        }
        if (typeof check.bot === 'function') {
          return check.bot(bot, message, callback);
        } else {
          if (check.bot) {
            let result = (check.bot.test ? check.bot.test(message.text) : message.text === check.bot);
            let error = null;
            if (!result) {
              error = `[Error on step - ${step}]  <${message.text}> does not match <${check.bot}>`;
            }
            callback(error);
          } else {
            callback(`No input message in:\n${JSON.stringify(check)}`);
          }
        }
      } else if ( check.endConversation ) {
        _d('log')(`BOT: >> endConversation`);
        callback();
      } else if ( check.typing ) {
        _d('log')(`BOT: >> typing`);
        callback();
      } else {
        throw new Error(`Unable to find matching validator for step #${step}. Step:\n${JSON.stringify(check)}`);
      }
    }
    function proceedNextStep() {
      if (step == messages.length) {
        _d('log')('SCRIPT FINISHED');
        setTimeout(done, FINISH_TIMEOUT); // Enable message from connector to appear in current test suite
        return;
      }

      if (messages[step].user) {
        let check = messages[step];

        _d('log')(`Step: #${step}`);
        _d('log')('User: >> ' + check.user);
        _d('log')('Iterating to next step from user message');;
        step++;
        callTrigger(check, bot, 'before')
        let messagePromise = null;
        if ("function" === typeof check.user) {
          messagePromise = new Promise((resolve, reject) => {
            check.user(bot, resolve, reject);
          });
        } else {
          messagePromise = Promise.resolve(check.user);
        }
        messagePromise.then((message) => {
          if ("object" == typeof message) {
            if (!message.data.address) {
              message.address({
                channelId: 'console',
                user: {id: 'user', name: 'User1'},
                bot: {id: 'bot', name: 'Bot'},
                conversation: {id: 'Convo1'}
              });
            }
            connector.onEventHandler([message.toMessage()]);
          } else {
            connector.processMessage(message);
          }
          callTrigger(check, bot, 'after');
        }, (err) => {
          throw err;
        });
        if ( step <= messages.length && (messages[step].user) ) {
          setTimeout( function () {
            proceedNextStep();
          }, NEXT_USER_MESSAGE_TIMEOUT)

        }
      }

    }
    function startTesting() {
      if (messages.length) {
        let intro = '';
        messages.forEach( ( item, i ) => {
          intro = intro + (`${i}: ${JSON.stringify(item)}\n`);
        })
        //
        _d('log')(intro);
        proceedNextStep();
      }
    }
    function setupTimeout() {
      if ( options.timeout ) {
        setTimeout( () => {
          fail(`Default timeout (${options.timeout}) exceeded`);
        }, options.timeout );
      }
    }
    function setupReplyReceiver() {
      bot.on('send', function (message) {
        let inRange = (step > 0) && (step < messages.length);
        _d('log')(`Step: #${step}\nReceived message from bot:`);

        if (inRange) {
          var check = messages[step];
          _d('log')(check);
          _d('log')('Iterating to next step from bot message');;
          step++;
          callTrigger(check, bot, 'before', message);
          checkBotMessage(message, check, (err) => {
            callTrigger(check, bot, 'after', err);
            if (err) {
              fail(err);
            } else {
              proceedNextStep();
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
  log : console.log
}
function _d( name ) {
  return testBot.dependencies[name];

}

module.exports = testBot;