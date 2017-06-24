const assert = require('assert');
const MESSAGE_TIMEOUT = 20;

function testBot(bot, messages, done) {
  function callTrigger(check, bot, name, args) {
    if ("function" == typeof check[name]) {
      check[name](bot, args);
    }
  }

  return new Promise(function (resolve, reject) {
    var step = 0;
    var connector = bot.connector('console');
    if (done) {
      let original = done;
      done = () => {
        original();
        resolve();
      };
    } else {
      done = resolve;
    }

    function checkInMessage(message, check, callback) {

      if (typeof check.in === 'function') {
        return check.in(bot, message, callback);
      } else {
        if (check.in) {
          let result = (check.in.test ? check.in.test(message.text) : message.text === check.in);
          let error = null;
          if (!result) {
            error = `<${message.text} does not match <${check.in}>`;
          }
          callback(error);
        } else {
          callback("No input message");
        }

      }
    }


    function proceedNextStep() {
      if (step == messages.length) {
        console.log('SCRIPT FINISHED');
        setTimeout(done, MESSAGE_TIMEOUT); // Enable message from connector to appear in current test suite
        return;
      }

      if (messages[step].out) {
        let check = messages[step];

        console.log(`Step: #${step}`);
        console.log('User >> ' + check.out);
        step++;
        callTrigger(check, bot, 'before')
        let messagePromise = null;
        if ("function" === typeof check.out) {
          messagePromise = new Promise((resolve, reject) => {
            check.out(bot, resolve, reject);
          });
        } else {
          messagePromise = Promise.resolve(check.out);
        }
        messagePromise.then((message) => {
          if ("object" == typeof message) {
            if (!message.data.address) {
              message.address({
                channelId: 'console',
                user: {id: 'user', name: 'User1'},
                bot: {id: 'bot', name: 'Bot'},
                conversation: {id: 'Convo1'}
              });
            }
            connector.onEventHandler([message.toMessage()]);
          } else {
            connector.processMessage(message);
          }
          callTrigger(check, bot, 'after');
        }, (err) => {
          throw err;
        });
      }

    }

    bot.on('send', function (message) {
      let inRange = (step > 0) && (step <= messages.length);
      if (inRange) {
        var check = messages[step];
        console.log(`Step: #${step}`);
        console.log(`BOT >> ${message.text}`);
        step++;

        callTrigger(check, bot, 'before', message);
        checkInMessage(message, check, (err) => {
          callTrigger(check, bot, 'after', err);
          if (err) {
            fail(err);
            done();
            return;
          } else {
            proceedNextStep();
          }
        });
      }
      else {
        assert(false);
        setTimeout(done, MESSAGE_TIMEOUT); // Enable message from connector to appear in current test suite
      }
    });
    if (messages.length) {
      proceedNextStep();
    }
  })
}

module.exports = testBot;