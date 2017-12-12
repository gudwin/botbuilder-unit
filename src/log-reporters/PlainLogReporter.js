/* jslint es6 */
'use strict';

const BaseLogReporter = require('./BaseLogReporter');
const util = require('util');

function PlainLogReporter() {
  BaseLogReporter.call(this);
}
PlainLogReporter.prototype = Object.create(BaseLogReporter.prototype);
PlainLogReporter.prototype.constructor = PlainLogReporter;

PlainLogReporter.prototype.scriptFinished = function (step) {
  console.log(`#${step} Script finished`);
}
PlainLogReporter.prototype.normizalizeForOutput = function (message) {
  return util.inspect(message, {depth: 4, color: false, showHidden: true})
}

PlainLogReporter.prototype.messageReceived = function (step, message) {
  let outputMessage = this.normizalizeForOutput(message);
  console.log(`#${step} Bot: ${outputMessage}`);
}
PlainLogReporter.prototype.endConversation = function (step) {
  console.log(`#${step} End of conversation`);
}
PlainLogReporter.prototype.typing = function (step) {
  console.log(`#${step} Typing...`);
}
PlainLogReporter.prototype.messageSent = function (step, message) {
  let outputMessage = '';
  if ("function" == typeof message.user) {
    outputMessage = message.user.toString();
  } else {
    outputMessage = message.user ? message.user : this.normizalizeForOutput(message);
  }
  console.log(`#${step} User: ${outputMessage}`);
}
PlainLogReporter.prototype.expectationError = function (step, received, expected) {
  let expectedErrorMsg = expected.bot ? expected.bot.toString() : this.normizalizeForOutput(( expected ));
  console.error(`#${step} Expectation Error: ${this.normizalizeForOutput(expectedErrorMsg)}`);
}
PlainLogReporter.prototype.error = function (step, message) {
  console.error(`#${step} Error: ${this.normizalizeForOutput(message)}`);
}
PlainLogReporter.prototype.warning = function (step, message) {
  console.log(`#${step} Warning: ${this.normizalizeForOutput(message)}`);
}
PlainLogReporter.prototype.info = function (step, message) {

  console.log(`#${step} Info: ${this.normizalizeForOutput(message)}`);
}
PlainLogReporter.prototype.session = function (step, session) {
  let output = {
    userData : Object.assign({}, session.userData),
    conversationData : Object.assign({}, session.conversationData),
    privateConversationData : Object.assign({}, session.privateConversationData),
    sessionState : Object.assign({}, session.sessionState)
  }
  console.log(`#${step} Session: ${this.normizalizeForOutput(output)}`);
}
PlainLogReporter.prototype.startupDialog = function (step, dialog, args) {
  this.isLeftPaddingEnabled = false;
  dialog = dialog || '';
  args = args || '';
  console.log(`#${step} Next Dialog: ${this.normizalizeForOutput(dialog)}`);
  console.log(`#${step} ARGS Set: ${this.normizalizeForOutput(args)}`);
}


module.exports = PlainLogReporter;