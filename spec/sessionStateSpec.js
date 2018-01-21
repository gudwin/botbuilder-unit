const botFactory = require('./lib/botFactory');
const unit = require('../');
describe('Support for session management functions', function () {

  let bot = null;
  let script = null;
  let sessionBot = () => {
    bot = botFactory();
    bot.dialog('/test', [
      (session) => {
        let name = session.userData.name;
        session.endDialog(`Hello, ${name}!`)
      }
    ])
  };
  beforeEach((done) => {
    done();
  });
  it('Should support initialization of session, before starting a conversation', (done) => {
    sessionBot();
    let script = [
      {
        session: {
          userData: {
            name: 'Gisma'
          }
        }
      },
      {
        user: 'Hi'
      },
      {
        bot: 'Hello, Gisma!'
      },
      {
        session: {
          userData: {
            name: 'Yulia'
          }
        }
      },
      {
        user: 'Hi'
      },
      {
        bot: "Hello, Yulia!"
      }
    ];
    unit(bot, script).then(done,(e) => {
      fail('Aaaah... Fuck!')
      done();
    });
  });
  it('Should support filtering callbacks ', (done) => {
    sessionBot();
    let script = [
      {
        session: function (currentSession) {
          currentSession.userData.name = 'Gisma';
          return Promise.resolve(currentSession);
        }
      },
      {
        user: 'Hi'
      },
      {
        bot: 'Hello, Gisma!'
      },
      {
        session: (currentSession) => {
          currentSession.userData.name = '123' + currentSession.userData.name
          return Promise.resolve(currentSession);
        }
      },
      {
        user: 'Hi'
      },
      {
        bot: 'Hello, 123Gisma!'
      }
    ]
    unit(bot, script).then(done);
  })
  it('Should support multiple session modificator', (done) => {
    sessionBot();
    let script = [
      {
        session : {userData: {name : "Gi"}}
      },
      {
        session: function (currentSession) {////
          currentSession.userData.name += 'sma';
          return Promise.resolve(currentSession);
        }
      },
      {
        user: 'Hi'
      },
      {
        bot: 'Hello, Gisma!'
      },
      {
        session: (currentSession) => {
          currentSession.userData.name = '123' + currentSession.userData.name
          return Promise.resolve(currentSession);
        }
      },
      {
        user: 'Hi'
      },
      {
        bot: 'Hello, 123Gisma!'
      }
    ]
    unit(bot, script).then(done);
  })

})