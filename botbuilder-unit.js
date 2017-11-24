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
const SessionMessage = require('./src/messages/SessionMessage');
const SetDialogMessage = require('./src/messages/SetDialogMessage');


function detectReporter() {
  switch (process.env.BOTBUILDERUNIT_REPORTER) {
    case 'beauty':
      return (new BeautyLogReporter());
    case 'empty' :
      return (new EmptyLogReporter());
    case 'plain' :
    default:
      return (new PlainLogReporter());
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
        validationMessage.validate(step, message)
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
    function isNextSendNeeded() {
      let shouldProceed = messages.length && (
          messages[0].session || messages[0].user
          || (messages[0].dialog || messages[0].args)
        );
      return shouldProceed;
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

      if (isNextSendNeeded()) {
        let messageConfig = messages.shift();
        step++;
        setTimeout(() => {
          MessageFactory.produce(messageConfig, bot, getLogReporter())
            .send(step)
            .then(() => {
                next();
            })
            .catch(function (err) {
              fail(err)
            });
        }, NEXT_USER_MESSAGE_TIMEOUT );
      } else {
      }

    }


    function startTesting() {
      if (messages.length) {
        getLogReporter().newScript(messages, options.title);
        step = -1;
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
        getLogReporter().messageReceived(step, message);
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
  reporter: detectReporter()
};

module.exports.PlainLogReporter = PlainLogReporter;
module.exports.BeautyLogReporter = BeautyLogReporter;
module.exports.EmptyLogReporter = EmptyLogReporter;
module.exports.ConversationMock = require('./src/ConversationMock');
module.exports.BotMessage = BotMessage;
module.exports.UserMessage = UserMessage;
module.exports.SetDialogMessage = SetDialogMessage;
module.exports.SessionMessage = SessionMessage;
module.exports.DEFAULT_ADDRESS = SessionMessage.DEFAULT_ADDRESS;