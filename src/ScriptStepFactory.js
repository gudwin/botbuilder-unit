/* jslint es6 */
'use strict';

const BotMessage = require('./messages/BotMessage');
const CustomMessage = require('./messages/CustomMessage');
const UserMessage = require('./messages/UserMessage');
const SessionMessage = require('./messages/SessionMessage');
const SetDialogMessage = require('./messages/SetDialogMessage');
function MessageFactory() {

}
MessageFactory.produce = function (step, config, bot, logReporter, prevStepPromise) {
  let isBot = ("undefined" != typeof config.bot) || config.endConversation || config.typing;
  if (isBot) {
    return new BotMessage(step, config, bot, logReporter, prevStepPromise);
  }
  let isUser = "undefined" != typeof config.user;
  if (isUser) {
    return new UserMessage(step, config, bot, logReporter, prevStepPromise)
  }
  let isSession = "undefined" != typeof config.session;
  if (isSession) {
    return new SessionMessage(step, config, bot, logReporter, prevStepPromise);
  }
  let isSetDialog = ("undefined" != typeof config.dialog) || ("undefined" != typeof config.args );
  if (isSetDialog) {
    return new SetDialogMessage(step, config, bot, logReporter, prevStepPromise)
  }
  let isCustomDialog = "function" === typeof config.custom;
  if (isCustomDialog) {
    return new CustomMessage(step, config, bot, logReporter, prevStepPromise)
  }
  throw new Error('Unsupported config - ' + JSON.stringify(config));

}
module.exports = MessageFactory;