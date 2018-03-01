const botFactory = require('./lib/botFactory');
const unit = require('../');

describe('Managing current dialog of conversation', function () {
  let bot = null;
  let testBot = () => {
    bot = botFactory();
    bot.dialog('/test', [
      (session) => {
        session.endDialog(`Hello, %username%!`)
      }
    ])
    bot.dialog('/my-test', [
      (session) => {
        session.endDialog(`You triggered unreachable dialog!`)
      }
    ])
    bot.dialog('/named-greeting', [
      (session, arguments) => {
        session.endDialog(`Hello, ${arguments.username}!`);
      }
    ])
  };
  beforeEach((done) => {
    testBot();
    done();
  });
  it('Should support startup dialog setting', (done) => {
    let script = [
      {dialog: "/my-test"},
      {user: "Hi"},
      {bot: 'You triggered unreachable dialog!'},
      {user: "Hi"},
      {bot: 'You triggered unreachable dialog!'}
    ];
    unit(bot, script).then(done, (e) => {
      fail(e)
      done();
    });
  });
  it('Should support setting up dialog in the middle of conversation', (done)=> {
    let script = [
      {user: "Hi"},
      {bot: 'Hello, %username%!'},
      {user: "Hi"},
      {bot: 'Hello, %username%!'},
      {dialog: "/my-test"},
      {user: "Hi"},
      {bot: 'You triggered unreachable dialog!'}
    ];
    unit(bot, script).then(done, (e) => {
      fail('Impossible case');
      done();
    });
  });
  it('Default arguments supported', (done)=> {
    let script = [
      {user: "Hi"},
      {bot: 'Hello, %username%!'},
      {dialog: "/named-greeting", args : {username : "BadManMe"}},
      {user: "Hi"},
      {bot: 'Hello, BadManMe!'}
    ];
    unit(bot, script).then(done, (e) => {
      fail('Impossible case');
      done();
    });
  })
  it('Test that arguments captchured without dialog argument', (done) => {
    let script = [
      {dialog: "/named-greeting", args : {username : "BadManMe"}},
      {user: "Hi"},
      {bot: 'Hello, BadManMe!'},
      {args : {username : "Gisma"}},
      {user: "Hi"},
      {bot: 'Hello, Gisma!'}
    ];
    unit(bot, script).then(done, (e) => {
      fail('Impossible case');
      done();
    });
  });
  it('Test when session already exists',(done) => {
    let script = [
      {user: "Hi"},
      {bot: 'Hello, %username%!'},
      {dialog: "/named-greeting", args : {username : "BadManMe"}},
      {user: "Hi"},
      {bot: 'Hello, BadManMe!'},
      {dialog: "/named-greeting", args : {username : "UserStory"}},
      {user: "Hi"},
      {bot: 'Hello, UserStory!'},
    ]
    unit(bot, script).then(done, (e) => {
      fail('Impossible case');
      done();
    });
  })
});