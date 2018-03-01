'use strict';

const BaseScriptStep = require('./BaseScriptStep');

function CustomMessage(step, config, bot, logReporter, prevStepPromise ) {
  BaseScriptStep.call(this,step,config,bot,logReporter,prevStepPromise);

  this.stepFinishedPromise = Promise.all([prevStepPromise] ).then(() => {
    return this.send();
  });
}
CustomMessage.prototype = Object.create(BaseScriptStep.prototype);
CustomMessage.prototype.constructor = CustomMessage;

CustomMessage.prototype.send = function () {

  this.logReporter.customStep(this.step, this.config);

  let result = this.config['custom'].call(this);
  if ( !(result instanceof Promise )) {
    throw new Error('Custom step should return a Promise');
  }
  return result;
}

module.exports = CustomMessage;