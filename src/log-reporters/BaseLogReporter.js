'use strict';

function BaseLogReporter() {

}

BaseLogReporter.prototype.newScript = function (messages, scriptName) {
  let intro = '';
  messages.forEach((item, i) => {
    item = Object.assign({}, item);
    for (var key in item) {
      if (item.hasOwnProperty(key) && ("function" == typeof (item[key]))) {
        item[key] = '[[Function]]';
      }
    }
    intro = intro + (`${i}: ${JSON.stringify(item)}\n`);
  });
  console.log(intro);
}
BaseLogReporter.prototype.scriptFinished = function (step) {

}
BaseLogReporter.prototype.messageReceived = function (step, message) {

}
BaseLogReporter.prototype.endConversation = function (step) {

}
BaseLogReporter.prototype.typing = function (step) {

}
BaseLogReporter.prototype.messageSent = function (step, message) {

}
BaseLogReporter.prototype.expectationError = function (step, received, expected) {

}
BaseLogReporter.prototype.error = function (step, message) {

}
BaseLogReporter.prototype.warning = function (step, message) {

}
BaseLogReporter.prototype.info = function (step, message) {

}
BaseLogReporter.prototype.session = function (step, message) {

}

module.exports = BaseLogReporter;