const BaseScriptStep = require('./BaseScriptStep');
const inspect = require('util').inspect;
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

BotMessage.prototype.isStepHasValidator = function () {
  return ("undefined" != typeof this.config.bot)
    || ("undefined" != typeof this.config.suggestedActions)
    || ("undefined" != typeof this.config.attachments)
    || ("undefined" != typeof this.config.endConversation)
    || ("undefined" != typeof this.config.typing)
}


BotMessage.prototype.validate = function () {

  return new Promise((resolve, reject) => {
    if (null == this.receivedMessage) {
      let msg = 'Can\'t continue validation. There are no received message';
      reject(msg);
      return;
    }
    if (!this.isStepHasValidator()) {
      let msg = `Unable to find matching validator. Step config:\n${inspect(this.config)}`;
      reject();
      return;
    }

    this.validateSuggestedActions()
      .then(() => {
        return this.validateAttachments();
      })
      .then(() => {
        return this.validateAttachmentLayout();
      })
      .then(() => {
        return this.validateBotMessage();
      })
      .then(() => {
        return this.validateEndConversation();
      })
      .then(() => {
        return this.validateTyping();
      })
      .then(resolve)
      .catch((error) => {
        this.logReporter.info(`Expected message at step ${this.step}`, this.config);
        this.logReporter.expectationError(this.step, this.receivedMessage, error);
        reject(error);
      })
  })
}

BotMessage.prototype.validateBotMessage = function () {
  if (!this.config.bot) {
    return Promise.resolve();
  }
  if ("function" == typeof this.config.bot) {
    let promise = this.config.bot.call(null, this.receivedMessage);
    if (!(promise instanceof Promise )) {
      let error = `Message validation by callback failed. Callback MUST return a promise `;
      return Promise.reject(error);
    }
    return promise.catch((error) => {
      return Promise.reject(error);
    })
  } else {
    let isRegExp = this.config.bot.test ? true : false;
    let result = isRegExp ? this.config.bot.test(this.receivedMessage.text) : this.receivedMessage.text === this.config.bot;
    if (!result) {
      let error = `Received text <${this.receivedMessage.text}> does not match <${this.config.bot}>`;
      return Promise.reject(error);
    }
    return Promise.resolve();

  }
}
BotMessage.prototype.validateTyping = function () {
  if (!this.config.typing) {
    return Promise.resolve();
  }
  if ("typing" == this.receivedMessage.type) {
    this.logReporter.typing(this.step);
    return Promise.resolve();
  } else {
    let msg = 'Typing indicator expected';
    return Promise.reject(msg);
  }
}
BotMessage.prototype.validateEndConversation = function () {
  if (!this.config.endConversation) {
    return Promise.resolve();
  }
  if ("endOfConversation" == this.receivedMessage.type) {
    this.logReporter.endConversation(this.step);
    return Promise.resolve();
  } else {
    let msg = 'endConversation indicator expected'
    return Promise.reject(msg);
  }
}
BotMessage.prototype.validateAttachmentLayout = function () {
  if (!this.config.attachmentLayout) {
    return Promise.resolve();
  }
  if ("function" == typeof this.config.attachmentLayout) {
    let promise = this.config.attachmentLayout.call(null, this.receivedMessage.attachmentLayout);
    if (!(promise instanceof Promise )) {
      let msg = `Attachment layout validation by callback failed. Callback MUST return a promise`;
      return Promise.reject((msg));
    }
    return promise.catch(() => {
      let msg = `Attachment layout validation by callback failed.`;
      return Promise.reject((msg));
    })
  } else if (this.config.attachmentLayout == this.receivedMessage.attachmentLayout) {
    return Promise.resolve();
  } else {
    let msg = `Attachment layout validation failed:<${this.receivedMessage.attachmentLayout}> does not match <${this.config.attachmentLayout}>`;
    return Promise.reject(msg);
  }
}

BotMessage.prototype.validateAttachments = function () {
  if (!this.config.attachments) {
    return Promise.resolve();
  }

  let iterateAndValidate = function (validatorConfig, receivedValue, path) {
    if ("function" == typeof validatorConfig) {
      let promise = validatorConfig.call(null, receivedValue, path);
      if (!(promise instanceof Promise )) {
        throw ('Attachment validation by callback failed. Callback MUST return a Promise');
      }

      return promise.catch((error) => {
        let msg = `Attachment validation by callback failed. Path: ${path}`;
        if (error) {
          msg += ' Error:' + inspect(error)
        }
        throw (msg);
      })
    } else if (Array.isArray(validatorConfig)) {
      if (!Array.isArray(receivedValue)) {
        let msg = `Attachment validation failed, array must exist at path: ${path}`;
        throw msg;
      }
      validatorConfig.forEach((item, i) => {
        iterateAndValidate(item, receivedValue[i], path + `[${i}]`)
      });
    } else if ("object" == typeof validatorConfig) {
      if ("object" != typeof receivedValue) {
        let msg = `Attachment validation failed, object must exist at path: ${path}`;
        throw msg;
      }
      for (let key in validatorConfig) {
        if (!validatorConfig.hasOwnProperty(key)) {
          continue;
        }
        iterateAndValidate(validatorConfig[key], receivedValue[key], path + `[${key}]`);
      }
    } else if (validatorConfig != receivedValue) {
      let msg = `Attachment validation failed at path: ${path}`;
      throw msg;
    }

  }
  try {
    iterateAndValidate(this.config.attachments, this.receivedMessage.attachments, 'attachments');
  } catch (e) {
    return Promise.reject(e);
  }
  return Promise.resolve();
}
BotMessage.prototype.validateSuggestedActions = function () {

  if (!this.config.suggestedActions) {
    return Promise.resolve();
  }
  let isSuggestedActionsPresent = this.receivedMessage.suggestedActions
    && this.receivedMessage.suggestedActions.actions
    && this.receivedMessage.suggestedActions.actions.length;
  if (!isSuggestedActionsPresent) {
    let msg = `Step #${this.step}, Message misses Suggested Actions`;
    return Promise.reject(msg);
  }
  let isRangeError = this.config.suggestedActions.length != this.receivedMessage.suggestedActions.actions.length;
  if (isRangeError) {
    let msg = (`Step #${this.step}, amount of received suggested actions (${this.receivedMessage.suggestedActions.actions.length}) differs from expected (${this.config.suggestedActions.length})`);
    return Promise.reject(msg);
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
      let msg = `Step #${this.step}, Failed to compare actions with index ${i}. Reasons:`;
      if ( !isSameTitle ) {
        msg += `\n- Expected title: ${expectedAction.data.title}\n- Received title: ${messageAction["title"]}`;
      }
      if ( !isSameType ) {
        msg += "\n- Wrong type of the card";
      }
      if ( !isSameValue ) {
        msg += `\n- Messages are different:\n- Expected value: ${expectedAction.data.value}\n- Received value: ${messageAction['value']}`;
      }

      return Promise.reject(msg);

    }
  }
  return Promise.resolve();
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