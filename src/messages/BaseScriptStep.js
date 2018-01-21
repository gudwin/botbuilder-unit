function BaseScriptMessage(step, config, bot, logReporter, prevStepPromise) {
  this.config = config;
  this.bot = bot;
  this.logReporter = logReporter;
  this.step = step;
  this.stepFinishedPromise = null;
}

BaseScriptMessage.prototype.getStepFinishedPromise = function() {
  return this.stepFinishedPromise;
}

module.exports = BaseScriptMessage;