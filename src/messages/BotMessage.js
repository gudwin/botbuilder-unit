function BotMessage(config, bot, logReporter) {
  this.config = config;
  this.bot = bot;
  this.logReporter = logReporter;
  this.beforeFunc = this.config.before || function () {
      return Promise.resolve();
    }
  this.afterFunc = this.config.after || function () {
      return Promise.resolve();
    };
}
BotMessage.prototype.validate = function (step, receivedMessage) {
  return new Promise((resolve, reject) => {
    this.beforeFunc(this.config, this.bot)
      .then(() => {

        if ("undefined" != typeof this.config.bot) {
          this.logReporter.messageReceived(step, receivedMessage);
          if (typeof this.config.bot === 'function') {
            return this.config.bot(this.bot, receivedMessage);
          }
          else {
            if (this.config.bot) {
              let result = (this.config.bot.test ? this.config.bot.test(receivedMessage.text) : receivedMessage.text === this.config.bot);
              if (!result) {
                this.logReporter.expectationError(step, receivedMessage, this.config);
                error = `Step #${step}, <${receivedMessage.text}> does not match <${this.config.bot}>`;
                reject(error);
              }
            }
            else {
              let msg = `No input message in step configuration:\n${JSON.stringify(this.config)}`
              this.logReporter.error(step, msg );
              reject(msg);
            }
            return true;
          }
        } else if (this.config.endConversation) {
          this.logReporter.endConversation(step);
          return true;
        } else if (this.config.typing) {
          this.logReporter.typing(step);
          return true;
        } else {
          let msg = `Unable to find matching validator. Step config:\n${JSON.stringify(this.config)}`;
          this.logReporter.error(step, msg );
          reject(msg);
        }
      })
      .then(() => {
        return this.afterFunc(this.config, this.bot);
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      })
  });
}
module.exports = BotMessage;