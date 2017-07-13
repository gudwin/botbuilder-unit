const botFactory = require('./botFactory');
const unit = require('../');
const builder = require('botbuilder');
const util = require('util');
describe('Prompts Test Suite: make sure that default Prompts supported', function () {
  let bot = null;
  let test = function (type, done, callback, responseCallback) {
    bot = botFactory();
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
    unit(bot, script).then( function () {
      done();
    });;
  }
  it('Should support Prompt.text', function (done) {
    test('text', done, function (session) {
      builder.Prompts.text(session, 'Please type any text')
    });
  });

  it('Should support Prompt.confirm', function (done) {
    test('confirm', done, function (session) {
      builder.Prompts.text(session, 'Please select yes or no')
    });
  });

  it('Should support Prompt.number', function (done) {
    test('number', done, function (session) {
      builder.Prompts.number(session, 'Please type any number')
    });
  });

  it('Should support Prompt.time', function (done) {
    test('time', done, function (session) {
      builder.Prompts.time(session, 'Please type any date')
    }, function (session, results) {
      let date = new Date(results.response.resolution.start);
      session.endDialog(`Your response is:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    });
  });

  it('Should support Prompt.choices', function (done) {
    test('choices', done, function (session) {
      builder.Prompts.choice(session, 'Please select any choice', 'red|green|blue')
    }, (session, results) => {
      session.endDialog(`Your response is:${results.response.entity}`);
    });
  });

  it('Should support Prompts.attachment', function (done) {
    test('attachment', done, (session,next) => {
      // looks like there is a bug in MBF, and because of that
      // i'm writing another shitty line of code
      let message = new builder.Message(session);
      message.text('Please upload an attachment');
      builder.Prompts.attachment(session, message, {
        "textFormat": "markdown",
        disableRecognizer: true
      });
    }, (session, results) => {
      session.endDialog(`Your response is:${results.response[0].name}:${results.response[0].contentType}`);
    });
  });
})