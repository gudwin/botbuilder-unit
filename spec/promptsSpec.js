const botFactory = require('./botFactory');
const unit = require('../');
const builder = require('botbuilder');
const util = require('util');
describe('Prompts Test Suite: make sure that default Prompts supported', function () {
  let bot = null;
  let test = function (type, callback, responseCallback) {
    let bot = botFactory();
    let script = require(`./scripts/prompts/${type}`);
    let waterfall = [callback];
    if (responseCallback) {
      waterfall.push(responseCallback);
    } else {
      waterfall.push(function (session, response) {
        session.endDialog('Your response is:' + response.response);
      });
    }
    bot.dialog('/test', waterfall)
    unit(bot, script, done);
  }
  it('Should support Prompt.text', function (done) {
    test('text', function (session) {
      builder.Prompts.text(session, 'Please type any text')
    });
  });

  it('Should support Prompt.confirm', function (done) {
    test('confirm', function (session) {
      builder.Prompts.text(session, 'Please select yes or no')
    });
  });

  it('Should support Prompt.number', function (done) {
    test('number', function (session) {
      builder.Prompts.number(session, 'Please type any number')
    });
  });

  it('Should support Prompt.time', function (done) {
    test('time', function (session) {
      builder.Prompts.time(session, 'Please type any date')
    }, function (session, results) {
      session.endDialog(`Your response is:${results.response.getYear()}-${results.response.getMonth()}-${results.response.getDate()}`);
    });
  });

  it('Should support Prompt.choices', function (done) {
    test('choices', function (session) {
      builder.Prompts.choices(session, 'Please select any choice', 'red|green|blue')
    });
  });

  it('Should support Prompt.attachment', function (done) {
    test('attachmnet', function (session) {
      builder.Prompts.attachment(session, 'Please upload an attachment')
    });
  }, function (session, results) {
    session.endDialog(`Your response is:${results.response.name}:${results.response.contentType}`);
  });
})