'use strict';

const BaseLogReporter = require('./BaseLogReporter');

function EmptyLogReporter() {
  BaseLogReporter.call(this);
}

EmptyLogReporter.prototype = Object.create(BaseLogReporter.prototype);
EmptyLogReporter.prototype.constructor = EmptyLogReporter;


EmptyLogReporter.prototype.newScript = function (intro) {

}
EmptyLogReporter.prototype.scriptFinished = function () {

}
EmptyLogReporter.prototype.messageReceived = function (step, message) {

}
EmptyLogReporter.prototype.endConversation = function (step) {

}
EmptyLogReporter.prototype.typing = function (step) {

}
EmptyLogReporter.prototype.messageSent = function (step, message) {

}
EmptyLogReporter.prototype.customStep = function (step, message) {

}
EmptyLogReporter.prototype.expectationError = function (step, received, error) {

}
EmptyLogReporter.prototype.error = function (errorHeader, message) {

}
EmptyLogReporter.prototype.warning = function (warningHeader, message) {

}
EmptyLogReporter.prototype.info = function (infoHeader, message) {

}
EmptyLogReporter.prototype.session = function (step, message) {

}




module.exports = EmptyLogReporter;