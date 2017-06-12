module.exports = [
  {
    "out": "hi"
  },
  {
    "in": 'Say hello?'
  },
  {
    "out": function (bot, done) {
      done('Hello world!');
    }
  },
  {
    "in": function (bot, message, done) {
      let fixture = 'You typed: Hello world!';
      if (message.text == fixture) {
        done();
      } else {
        done(`Failed to match message "${message.text}" to "${fixture}"`);
      }
    }
  },
  {
    "out": "hi"
  },
  {
    "in": 'Say hello?'
  },
  {
    "out": 'Hello MBF'
  },
  {
    "in": /MBF/i
  }
];