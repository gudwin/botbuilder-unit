const assert = require('assert');
const MESSAGE_TIMEOUT = 20;

function testBot(bot, messages, done) {
  function callTrigger(check, bot, name, args) {
    if ("function" == typeof check[name]) {
      check[name](bot,done);
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

    function checkInMessage(message, check, assert, callback) {
      if (check.type) {
        assert(message.type === check.type);
      }

      if (typeof check.in === 'function') {
        return check.in(bot, message, callback);
      } else {
        if (check.in) {
          let result = (check.in.test ? check.in.test(message.text) : message.text === check.in);
          let error = null;
          if ( !result ) {
            error = `<${message.text} does not match <${check.in}>`;
          }
          callback(error);
        } else {
          callback("No input message");
        }
        return callback();
      }
    }


    function proceedNextStep(done) {
      if (step == messages.length) {
        console.log('SCRIPT FINISHED');
        console.log( done );
        setTimeout(done, MESSAGE_TIMEOUT); // Enable message from connector to appear in current test suite
        return;
      }

      if (messages[step].out) {
        let check = messages[step];
        console.log(check);
        step++;
        console.log(`Step: #${step}`);
        console.log('User >> ' + check.out);

        callTrigger(check, bot, 'before')
        connector.processMessage(check.out);
        callTrigger(check, bot, 'after')
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
          checkInMessage(message, check, assert, function (err) {
            callTrigger(check, bot, 'after', err);
            proceedNextStep( done);
          });
        }
        else {
          assert(false);
          setTimeout(done, MESSAGE_TIMEOUT); // Enable message from connector to appear in current test suite
        }
      }
    )
    ;
    if (messages.length) {
      proceedNextStep(done);
    }
  })
    ;
}

module.exports = testBot;