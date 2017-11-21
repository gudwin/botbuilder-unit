const DEFAULT_ADDRESS = require('./SessionMessage').DEFAULT_ADDRESS;
function SetDialogMessage(config, bot, logger) {
  this.config = config;
  this.bot = bot;
  this.logger = logger;
}
SetDialogMessage.prototype.initSession = function () {
  return new Promise((resolve, reject) => {
    this.bot.loadSession(DEFAULT_ADDRESS, (session) => {
      return resolve(session);
    });
  });
}
SetDialogMessage.prototype.send = function (step) {
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
          resolve();
        } else {
          let dialog = this.config.dialog || this.bot.settings.defaultDialogId || '/';
          let dialogArgs = this.config.arguments || this.bot.settings.defaultDialogArgs || undefined;

          try {
            session.replaceDialog(dialog,dialogArgs);
          } catch (e ) {
            reject(e);
          }
          resolve();
        }
      })
  })

}

module.exports = SetDialogMessage;