/* jslint es6 */
'use strict';

const DEFAULT_ADDRESS = require('./SessionMessage').DEFAULT_ADDRESS;

const BaseScriptStep = require('./BaseScriptStep');

function SetDialogMessage(step, config, bot, logReporter, prevStepPromise ) {
  BaseScriptStep.call(this,step,config,bot,logReporter,prevStepPromise);

  this.stepFinishedPromise = Promise.all([prevStepPromise] ).then(() => {
    return this.send();
  });
}
SetDialogMessage.prototype = Object.create(BaseScriptStep.prototype);
SetDialogMessage.prototype.constructor = SetDialogMessage;

SetDialogMessage.prototype.initSession = function () {
  return new Promise((resolve, reject) => {
    this.bot.loadSession(DEFAULT_ADDRESS, (session) => {
      return resolve(session);
    });
  });
}
SetDialogMessage.prototype.send = function () {
  return new Promise((resolve, reject) => {
    this.initSession()
      .then((session) => {
        if (!session) {
          if ( "undefined" != typeof this.config.dialog ) {
            this.bot.settings.defaultDialogId = this.config.dialog;
          }
          if ( "undefined" != typeof this.config.args ) {
            this.bot.settings.defaultDialogArgs = this.config.args ;
          }

        } else {
          let dialog = this.config.dialog || this.bot.settings.defaultDialogId || '/';
          let dialogArgs = this.config.arguments || this.bot.settings.defaultDialogArgs || undefined;

          session.replaceDialog(dialog,dialogArgs);
        }
      })
    .then(() => {
      this.logReporter.startupDialog(this.step, this.config.dialog, this.config.args);
      resolve();
    })
    .catch((error) => {
      reject(error);
    })
  })

}

module.exports = SetDialogMessage;