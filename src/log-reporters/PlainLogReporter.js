/* jslint es6 */
'use strict';

const BaseLogReporter = require('./BaseLogReporter');
const util = require('util');

function PlainLogReporter() {
  BaseLogReporter.call(this);
}
PlainLogReporter.prototype = Object.create(BaseLogReporter.prototype);
PlainLogReporter.prototype.constructor = PlainLogReporter;

PlainLogReporter.prototype.scriptFinished = function () {
  console.log(`# Script finished`);
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
PlainLogReporter.prototype.customStep = function (step, message) {
  let outputMessage = '';
  if ("function" == typeof message.custom) {
    outputMessage = message.custom.toString();
  } else {
    outputMessage = message.custom ? message.custom : this.normizalizeForOutput(message);
  }
  console.log(`#${step} Custom Validation Step: ${outputMessage}`);
}
PlainLogReporter.prototype.expectationError = function (step, received, error) {
  let expectedErrorMsg =  this.normizalizeForOutput( error );
  console.error(`#${step} Expectation Error: ${this.normizalizeForOutput(expectedErrorMsg)}`);
}
PlainLogReporter.prototype.error = function (errorHeader, message) {
  if ( "undefined" == typeof errorHeader ) {
    errorHeader = 'Error:';
  }
  console.error(`# ${errorHeader} ${this.normizalizeForOutput(message)}`);
}
PlainLogReporter.prototype.warning = function (warningHeader, message) {
  if ( "undefined" == typeof warningHeader ) {
    warningHeader = 'WARNING:';
  }
  console.log(`# ${warningHeader} ${this.normizalizeForOutput(message)}`);
}
PlainLogReporter.prototype.info = function (infoHeader, message) {
  if ( !infoHeader ) {
    infoHeader = 'Info:';
  }
  console.log(`# ${infoHeader} ${this.normizalizeForOutput(message)}`);
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