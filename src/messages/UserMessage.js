/* jslint es6 */
'use strict';

const BaseScriptStep = require('./BaseScriptStep');

function UserMessage(step, config, bot, logReporter, prevStepPromise )  {
  BaseScriptStep.call(this,step,config,bot,logReporter,prevStepPromise);


  this.connector = this.bot.connector('console');

  this.stepFinishedPromise = Promise.all([prevStepPromise] ).then(() => {
    return this.send();
  });
}
UserMessage.prototype = Object.create(BaseScriptStep.prototype);
UserMessage.prototype.constructor = UserMessage;

UserMessage.prototype.send = function () {
  return new Promise((resolve, reject) => {
    this.logReporter.messageSent(this.step, this.config);

    Promise.resolve()
      .then(() => {
        if ("function" === typeof this.config.user) {
          return this.config.user();
        } else {
          return Promise.resolve(this.config.user);
        }
      })
      .then((message) => {
        if ("object" == typeof message) {
          if (!message.data.address) {
            message.address({
              channelId: 'console',
              user: {id: 'user', name: 'User1'},
              bot: {id: 'bot', name: 'Bot'},
              conversation: {id: 'Convo1'}
            });
          }
          this.connector.onEventHandler([message.toMessage()]);
        } else {
          this.connector.processMessage(message);
        }
        return true;
      })

      .then(() => {
        resolve();
      })
      .catch((err)=> {
        this.logReporter.error(this.step, err);
        reject(err);
      });
  })
};


module.exports = UserMessage;