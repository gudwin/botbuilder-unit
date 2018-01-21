/* jslint es6 */
'use strict';

const DEFAULT_ADDRESS = {
  channelId: 'console',
  user: {id: 'user', name: 'User1'},
  bot: {id: 'bot', name: 'Bot'},
  conversation: {id: 'Convo1'}
};
const BaseScriptStep = require('./BaseScriptStep');

function SessionMessage(step, config, bot, logReporter, prevStepPromise ) {
  BaseScriptStep.call(this,step,config,bot,logReporter,prevStepPromise);

  this.stepFinishedPromise = Promise.all([prevStepPromise] ).then(() => {
    return this.send();
  });
}
SessionMessage.prototype = Object.create(BaseScriptStep.prototype);
SessionMessage.prototype.constructor = SessionMessage;

SessionMessage.prototype.initSession = function () {
  return new Promise((resolve, reject) => {
    this.bot.loadSession(DEFAULT_ADDRESS, (session) => {
      return resolve(session);
    });
  });
}
SessionMessage.prototype.updateSessionState = function (session) {
  if ("function" == typeof this.config.session) {
    return new Promise((resolve, reject) => {
      this.config.session(session).then((response) => {
          resolve(session);
        })
        .catch(reject);
    })
  } else if ("object" == typeof this.config.session) {
    for (let key in this.config.session) {
      if (this.config.session.hasOwnProperty(key)) {
        if ("undefined" == session[key]) {
          session[key] = {};
        }
        let value = this.config.session[key];
        if ("object" == typeof value) {
          for (let field in value) {
            if (value.hasOwnProperty(field)) {
              session[key][field] = value[field];
            }
          }
        } else {
          session[key] = this.config.session[key];
        }
      }
    }
    return Promise.resolve(session);

  } else {
    return Promise.reject("Unable to storage scalar value" + data);
  }
}
SessionMessage.prototype.send = function () {
  return new Promise((resolve, reject) => {
    this.initSession()
      .then((session) => {
        if (!session) {
          let handler = (session) => {
            this.updateSessionState(session)
              .then(() => {
                this.logReporter.session(this.step, session);
                this.bot.removeListener('routing', handler);
                session.save();
              })
              .catch(reject);
          }
          this.bot.addListener('routing', handler);
          resolve();
        } else {
          this.updateSessionState(session).then((session) =>{
            this.logReporter.session(this.step, session);
            resolve(session);
          },reject);
        }
      })
  })

}

module.exports = SessionMessage;
module.exports.DEFAULT_ADDRESS = DEFAULT_ADDRESS;