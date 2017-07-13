module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": 'Say hello?'
  },
  {
    "user": function (bot, done) {
      done('Hello world!');
    }
  },
  {
    "bot": function (bot, message, done) {
      let fixture = 'You typed: Hello world!';
      if (message.text == fixture) {
        done();
      } else {
        done(`Failed to match message "${message.text}" to "${fixture}"`);
      }
    }
  },
  {
    "user": "hi"
  },
  {
    "bot": 'Say hello?'
  },
  {
    "user": 'Hello MBF'
  },
  {
    "bot": /MBF/i
  }
];