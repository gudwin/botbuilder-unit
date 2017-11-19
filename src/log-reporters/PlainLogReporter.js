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
PlainLogReporter.prototype.inspect = function (message) {
  return util.inspect(message, {depth: 4, color: false, showHidden: true})
}

PlainLogReporter.prototype.messageReceived = function (step, message) {
  let outputMessage = this.inspect(message);
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
    outputMessage = message.user ? message.user : this.inspect(message);
  }
  console.log(`#${step} User: ${outputMessage}`);
}
PlainLogReporter.prototype.expectationError = function (step, received, expected) {
  let expectedErrorMsg = expected.bot ? expected.bot : this.inspect(( expected ));
  console.error(`#${step} Expectation Error: ${this.inspect(expectedErrorMsg)}`);
}
PlainLogReporter.prototype.error = function (step, message) {
  console.error(`#${step} Error: ${this.inspect(message)}`);
}
PlainLogReporter.prototype.warning = function (step, message) {
  console.log(`#${step} Warning: ${this.inspect(message)}`);
}
PlainLogReporter.prototype.info = function (step, message) {
  console.log(`#${step} Info: ${this.inspect(message)}`);
}
PlainLogReporter.prototype.session = function (step, message) {
  let output = {
    userData : Object.assign({}, message.userData),
    conversationData : Object.assign({}, message.conversationData),
    privateConversationData : Object.assign({}, message.privateConversationData),
    sessionState : Object.assign({}, message.sessionState)
  }
  console.log(`#${step} Session: ${this.inspect(output)}`);
}


module.exports = PlainLogReporter;