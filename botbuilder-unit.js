"use strict";

const FINISH_TIMEOUT = 20;
const NEXT_USER_MESSAGE_TIMEOUT = 20;
const DEFAULT_TEST_TIMEOUT = 10000;

const MessageFactory = require('./src/message-factories/MessageFactory');
const PlainLogReporter = require('./src/log-reporters/PlainLogReporter');
const EmptyLogReporter = require('./src/log-reporters/EmptyLogReporter');
const BeautyLogReporter = require('./src/log-reporters/BeautyLogReporter');
const BotMessage = require('./src/messages/BotMessage');
const UserMessage = require('./src/messages/UserMessage');



function detectReporter() {
  switch (process.env.BOTBUILDERUNIT_REPORTER) {
    case 'beauty':
      return new BeautyLogReporter();
    case 'empty' :
      return new EmptyLogReporter();
    case 'plain' :
    default:
      return new PlainLogReporter();
  }
}


function testBot(bot, messages, options) {
  options = Object.assign({
    timeout: module.exports.config.timeout,
    reporter: module.exports.config.reporter,
    title: ''
  }, options);
  messages = messages.slice(0);

  function getLogReporter() {
    return options.reporter;
  }
  function callTrigger(check, bot, name, args) {
    if ("function" == typeof check[name]) {
      check[name](bot, args);
    }
  }

  return new Promise(function (resolve, reject) {
    var step = 0;
    var finished = false;
    var connector = bot.connector('console');

    function done() {
      finished = true;
      resolve();
    }

    function fail(err) {
      if (!finished) {
        getLogReporter().error(step, err);
      }
      finished = true;
      reject(err);
    }

    function checkBotMessage(message, check, doneCallback) {
      let validationMessage = MessageFactory.produce(check, bot, getLogReporter());
      if (validationMessage instanceof BotMessage) {
        validationMessage.validate(step - 1, message)
          .then(() => {
            doneCallback();
          })
          .catch((err) => {
            doneCallback(err);
          });
      } else {
        getLogReporter().expectationError(step, message, check);
        doneCallback(`STEP #${step}, Active message in a script not a BotMessage. `)
      }

    }

    function next() {
      if (!messages.length) {

        if (!finished) {
          finished = true;
          getLogReporter().scriptFinished(step);
          setTimeout(done, FINISH_TIMEOUT); // Enable message from connector to appear in current test suite
        } else {
        }
        return;
      }

      if (messages[0].user) {
        let messageConfig = messages.shift();
        MessageFactory.produce(messageConfig, bot, getLogReporter())
          .send(step)
          .then(function () {
            step++;
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


    function startTesting() {
      if (messages.length) {
        getLogReporter().newScript(messages, options.title);
        next();
      }
    }

    function setupTimeout() {
      if (options.timeout) {
        setTimeout(() => {
          if (!finished) {
            let msg = `Default timeout (${options.timeout}) exceeded`;
            fail(msg);
          }
        }, options.timeout);
      }
    }

    function setupReplyReceiver() {
      bot.on('send', function (message) {
        step++;
        if (messages.length) {
          var check = messages.shift();

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
          getLogReporter().warning(step, 'Ignoring message (Out of Range)');
          setTimeout(done, FINISH_TIMEOUT); // Enable message from connector to appear in current test suite
        }
      });
    }

    setupTimeout();
    setupReplyReceiver();
    startTesting();
  })
}

module.exports = testBot;
module.exports.config = {
  timeout: process.env.BOTBUILDERUNIT_TEST_TIMEOUT ? process.env.BOTBUILDERUNIT_TEST_TIMEOUT : DEFAULT_TEST_TIMEOUT,
  reporter: process.env.BOTBUILDERUNIT_REPORTER ? detectReporter() : new PlainLogReporter()
};
module.exports.PlainLogReporter = PlainLogReporter;
module.exports.BeautyLogReporter = BeautyLogReporter;
module.exports.ConversationMock = require('./src/ConversationMock');
module.exports.BotMessage = BotMessage;
module.exports.UserMessage = UserMessage;