function UserMessage(config, bot, logger, connector) {
  this.config = config;
  this.afterFunc = config.after || function (config, bot ) {
      return Promise.resolve();
    }
  this.beforeFunc = config.before || function (config, bot ) {
      return Promise.resolve();
    }

  this.logger = logger;
  this.bot = bot;
  this.connector = connector;
}

UserMessage.prototype.send = function () {
  return new Promise((resolve, reject) => {

    this.logger('User: >> ' + this.config.user);
    this.logger('Iterating to next step from user message');

    this.beforeFunc(this.config, this.bot)
      .then(() => {
        if ("function" === typeof this.config.user) {
          return this.config.user(this.bot);
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
        return this.afterFunc(this.config,this.bot );
      })
      .then(() => {
        resolve();
      })
      .catch((err)=> {
        reject(err);
      });
  })
}
module.exports = UserMessage;