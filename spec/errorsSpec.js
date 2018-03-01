const botFactory = require('./lib/botFactory');
const unit = require('../');

describe('Errors Test', function () {
  it('Will raise an error if messages do not match', function (done) {
    let bot = botFactory();
    let script = [
      {user: 'hi'},
      {bot: 'hi!'}
    ];

    bot.dialog('/test', [
      function (session) {
        session.endDialog('Hello world!')
      }
    ])


    unit(bot, script,{
      title : 'Will raise an error if messages do not match'
    }).then(function () {

    }, function (err ) {
      expect(err).toBe('Received text <Hello world!> does not match <hi!>');
      done();
    });
  });
  it('Check that bot callback returns a promise',(done) => {
    let bot = botFactory();
    let script = [
      {user: 'hi'},
      {bot: ( ) => {
        return null;
      }}
    ];
    bot.dialog('/test', [
      function (session) {
        session.endDialog('Hello world!')
      }
    ]);
    unit(bot, script,{
      title : 'Check that bot callback returns a promise'
    }).then(function () {
      fail('Impossible case');
      done();
    }, function (err ) {
      done();
    });
  });
  it('Check that bot callback could raise an error', (done) => {
    let bot = botFactory();
    let script = [
      {user: 'hi'},
      {bot: ( ) => {
        return Promise.reject(new Error('Internal error'));
      }}
    ];
    bot.dialog('/test', [
      function (session) {
        session.endDialog('Hello world!')
      }
    ]);
    unit(bot, script,{
      title : 'Check that bot callback returns a promise'
    }).then(function () {
      fail('Impossible case');
      done();
    }, function (err ) {
      //expect(err.message.toString()).toBe('Internal error');
      done();
    });
  })
})