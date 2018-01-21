const BaseScriptStep = require('./BaseScriptStep');

function BotMessage(step, config, bot, logReporter, prevStepPromise) {

  BaseScriptStep.call(this, step, config, bot, logReporter, prevStepPromise);
  this.receivedMessage = null;
  this.replyResolver = null;
  this.replyPromise = new Promise((resolve, reject) => {
    this.replyResolver = resolve;
  })

  this.stepFinishedPromise = Promise.all([prevStepPromise, this.replyPromise]).then(() => {
    return this.validate();
  });
}

BotMessage.prototype = Object.create(BaseScriptStep.prototype);
BotMessage.prototype.constructor = BotMessage;


BotMessage.prototype.getDefaultBotMessageValidator = function () {
  return () => {
    return new Promise((resolve, reject)=> {
      if (this.config.bot) {
        try {
          this.validateBotMessage(this.receivedMessage);
          this.validateSuggestedActions(this.receivedMessage);
        } catch (e) {
          this.logReporter.expectationError(this.step, this.receivedMessage, this.config);
          reject(e);
        }
      }
      else {
        let msg = `No input message in step configuration:\n${JSON.stringify(this.config)}`
        this.logReporter.error(this.step, msg);
        reject(msg);
      }
      resolve(true);

    })

  }
}
BotMessage.prototype.validate = function () {

  return new Promise((resolve, reject) => {
    Promise.resolve(true)
      .then(() => {
        if (null == this.receivedMessage) {
          let msg = 'Can\'t continue validation. There are no received message';
          this.logReporter.error(this.step, msg);
          reject(msg);
        }
        if ("undefined" != typeof this.config.bot) {
          let filter = null;
          if (typeof this.config.bot === 'function') {
            filter = this.config.bot
          }
          else {
            filter = this.getDefaultBotMessageValidator();
          }
          return filter(this.bot, this.receivedMessage);
        } else if (this.config.endConversation) {
          this.logReporter.endConversation(this.step, this.receivedMessage);
          return true;
        } else if (this.config.typing) {
          this.logReporter.typing(this.step);
          return true;
        } else {
          let msg = `Unable to find matching validator. Step config:\n${JSON.stringify(this.config)}`;
          this.logReporter.error(this.step, msg);
          reject(msg);
        }
      })

      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
  });
}

BotMessage.prototype.validateBotMessage = function () {
  let isRegExp = this.config.bot.test ? true : false;
  let result = false;
  if (isRegExp) {
    result = this.config.bot.test(this.receivedMessage.text);
  } else {
    result = this.receivedMessage.text === this.config.bot;
  }
  if (!result) {
    let error = `Step #${this.step}, <${this.receivedMessage.text}> does not match <${this.config.bot}>`;
    throw (error);
  }
  return result;
}

BotMessage.prototype.validateSuggestedActions = function () {
  let isSuggestedActionsNeeded = this.config.suggestedActions && this.config.suggestedActions.length;
  if (!isSuggestedActionsNeeded) {
    return;
  }
  let isSuggestedActionsPresent = this.receivedMessage.suggestedActions
    && this.receivedMessage.suggestedActions.actions
    && this.receivedMessage.suggestedActions.actions.length;
  if (!isSuggestedActionsPresent) {
    let msg = `Step #${this.step}, Message misses Suggested Actions`;
    throw (msg);
  }
  let isRangeError = this.config.suggestedActions.length != this.receivedMessage.suggestedActions.actions.length;
  if (isRangeError) {
    throw (`Step #${this.step}, amount of received suggested actions (${this.receivedMessage.suggestedActions.actions.length}) differs from expected  (${this.config.suggestedActions.length})`);
  }

  for (let i = 0; i < this.config.suggestedActions.length; i++) {
    let expectedAction = this.config.suggestedActions[i];
    let messageAction = this.receivedMessage.suggestedActions.actions[i];
    //
    let isSameType = messageAction['type'] == expectedAction.data['type'];
    let isSameValue = messageAction['value'] == expectedAction.data['value'];
    let isSameTitle = messageAction['title'] == expectedAction.data['title'];

    let isOk = isSameTitle && isSameType && isSameValue;
    if (!isOk) {
      let msg = `Step #${this.step}, Failed to compare actions with index ${i}. Reasons:`
        + (!isSameTitle ? "\n- Title differs" : '')
        + (!isSameType ? "\n- Wrong type of the card" : '')
        + (!isSameValue ? "\n - Messages are different" : '');

      throw (msg);
    }
  }
}
BotMessage.prototype.receiveBotReply = function (receivedMessage) {
  if (this.receivedMessage) {
    throw new Error('This step already has received message');
  }
  this.receivedMessage = receivedMessage;
  this.logReporter.messageReceived(this.step, receivedMessage);
  this.replyResolver();

}

module.exports = BotMessage;