"use strict";

const FINISH_TIMEOUT = 20;
const DEFAULT_TEST_TIMEOUT = 10000;

const SrcBasePath = process.env.BOTBUILDERUNIT_USE_INSTRUMENTED_SOURCE || './src';
const MessageFactory = require(SrcBasePath + '/ScriptStepFactory');
const PlainLogReporter = require(SrcBasePath + '/log-reporters/PlainLogReporter');
const EmptyLogReporter = require(SrcBasePath + '/log-reporters/EmptyLogReporter');
const BeautyLogReporter = require(SrcBasePath + '/log-reporters/BeautyLogReporter');
const BotMessage = require(SrcBasePath + '/messages/BotMessage');
const UserMessage = require(SrcBasePath + '/messages/UserMessage');
const SessionMessage = require(SrcBasePath + '/messages/SessionMessage');
const SetDialogMessage = require(SrcBasePath + '/messages/SetDialogMessage');
const TestConnector = require(SrcBasePath + '/TestConnector');
const detectReporter = require(SrcBasePath + '/detectReporter')

const builder = require('botbuilder');

/**
 * Wraps arrays and functions into instance of UniversalBot
 * Ensure that given bot has connector, otherwise inject TestConnector
 *
 * @param bot
 * @returns {*}
 */
function resolveBot(bot) {
  let isWaterfall = ("function" == typeof bot) || Array.isArray(bot);
  if (isWaterfall) {
    let dialog = bot;
    let connector = new TestConnector();
    bot = new builder.UniversalBot(connector);
    bot.dialog('/', dialog);
  } else if (bot instanceof builder.UniversalBot) {
    if ( !bot.connector()) {
      bot.connector('console', new TestConnector());
    }
  } else {
    throw new Error(`Unknown type of bot/dialog. Error: ${JSON.stringify(bot)}`);
  }
  return bot;
}


function testBot(bot, messages, options) {
  function getLogReporter() {
    return options.reporter;
  }

  bot = resolveBot(bot);
  options = Object.assign({
    timeout: module.exports.config.timeout,
    reporter: module.exports.config.reporter,
    title: ''
  }, options);
  messages = messages.slice(0);

  return new Promise(function (resolve, reject) {
    var step = 0;
    var finished = false;

    function done() {
      finished = true;
      getLogReporter().scriptFinished();
      resolve();
    }

    function fail(err) {
      if (!finished) {
        getLogReporter().error("Script failed with error:", err);
      }
      finished = true;
      reject(err);
    }


    /**
     * Convert script steps into promises, each step executed after previous
     * botmessage depends on previous step and bot response
     * customessage depends on previous step
     * session message depends on previous step
     * set dialog message depends on previous step
     * user message dependes on previos step
     */
    function startTesting() {
      getLogReporter().newScript(messages, options.title);
      let startTestingAction = null;
      let prevStepFinishedPromise = new Promise((resolve, reject) => {
        startTestingAction = resolve;
      });
      let logReporter = getLogReporter();

      messages.forEach((item, i) => {
        // Where:
        // i - step
        // this - is actual config of step
        let scriptStep = MessageFactory(i, item, bot, logReporter, prevStepFinishedPromise);
        messages[i] = scriptStep;
        prevStepFinishedPromise = scriptStep.getStepFinishedPromise()
        prevStepFinishedPromise.then(() => {
          step = i;
        }, fail)
      });

      prevStepFinishedPromise.then(done, fail);

      startTestingAction();

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
      let extraMessageIndex = messages.length;
      bot.on('send', function (message) {
        let found = false;
        messages.some((step) => {
          //
          // As bot could send multiple messages sequentially, next code tries to
          // secure library from the case when two or more replies will be received by
          // one step
          let botReplyFunc = step.receiveBotReply;
          if (botReplyFunc) {
            step.receiveBotReply = false;
            botReplyFunc.call(step, message);
            found = true;
            return -1;
          }
        })

        if (!found) {
          getLogReporter().messageReceived(extraMessageIndex, message)
          getLogReporter().warning(`Warning at EXTRA STEP ${extraMessageIndex}`, 'Ignoring message (Out of Range)');
          extraMessageIndex++;
          // As more messages could appear, I suppose that is better to track them
          setTimeout(done, FINISH_TIMEOUT);
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
  reporter: detectReporter(process.env.BOTBUILDERUNIT_REPORTER)
};

module.exports.PlainLogReporter = PlainLogReporter;
module.exports.BeautyLogReporter = BeautyLogReporter;
module.exports.EmptyLogReporter = EmptyLogReporter;
module.exports.ConversationMock = require(SrcBasePath + '/ConversationMock');
module.exports.BotMessage = BotMessage;
module.exports.UserMessage = UserMessage;
module.exports.SetDialogMessage = SetDialogMessage;
module.exports.SessionMessage = SessionMessage;
module.exports.TestConnector = TestConnector;
module.exports.DEFAULT_ADDRESS = SessionMessage.DEFAULT_ADDRESS;