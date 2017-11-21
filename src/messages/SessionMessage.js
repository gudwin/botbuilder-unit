const DEFAULT_ADDRESS = {
  channelId: 'console',
  user: {id: 'user', name: 'User1'},
  bot: {id: 'bot', name: 'Bot'},
  conversation: {id: 'Convo1'}
};

function SessionMessage(config, bot, logger) {
  this.config = config;
  this.bot = bot;
  this.logger = logger;

}
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
SessionMessage.prototype.send = function (step) {
  return new Promise((resolve, reject) => {
    this.initSession()
      .then((session) => {
        if (!session) {
          let handler = (session) => {
            this.updateSessionState(session)
              .then(() => {
                this.logger.session(step, session);
                this.bot.removeListener('routing', handler);
                session.save();
              })
              .catch(reject);
          }
          this.bot.addListener('routing', handler);
          resolve();
        } else {
          this.updateSessionState(session).then((session) =>{
            this.logger.session(step, session);
            resolve(session);
          },reject);
        }
      })
  })

}

module.exports = SessionMessage;
module.exports.DEFAULT_ADDRESS = DEFAULT_ADDRESS;