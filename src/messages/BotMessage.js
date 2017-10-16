function BotMessage(config, bot, logger) {
  this.config = config;
  this.bot = bot;
  this.logger = logger;
  this.beforeFunc = this.config.before || function () {
      return Promise.resolve();
    }
  this.afterFunc = this.config.after || function () {
      return Promise.resolve();
    };
}
BotMessage.prototype.validate = function (receivedMessage) {
  return new Promise((resolve, reject) => {
    if (receivedMessage.text) {
      this.logger(`BOT: >> ${(receivedMessage.text)}`);
    } else {
      this.logger(`BOT: >> ${JSON.stringify(receivedMessage)}`);
    }
    this.beforeFunc(this.config, this.bot)
      .then(() => {
        if (this.config.bot) {
          if (typeof this.config.bot === 'function') {
            return this.config.bot(this.bot, receivedMessage);
          }
          else {
            if (this.config.bot) {
              let result = (this.config.bot.test ? this.config.bot.test(receivedMessage.text) : receivedMessage.text === this.config.bot);
              if (!result) {
                error = `<${receivedMessage.text}> does not match <${this.config.bot}>`;
                reject(error);
              }
            }
            else {
              reject(`No input message in:\n${JSON.stringify(this.config)}`);
            }
            return true;
          }
        } else if (this.config.endConversation) {
          this.logger(`BOT: >> endConversation`);
          return true;
        } else if (this.config.typing) {
          this.logger(`BOT: >> typing`);
          return true;
        } else {
          reject(`Unable to find matching validator. Step config:\n${JSON.stringify(this.config)}`);
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