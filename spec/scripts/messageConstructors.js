module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": 'Say hello?'
  },
  {
    "user": function (bot) {
      return Promise.resolve('Hello world!');
    }
  },
  {
    "bot": function (bot, message) {
      let fixture = 'You typed: Hello world!';
      if (message.text == fixture) {
        return Promise.resolve();
      } else {
        return Promise.reject(`Failed to match message "${message.text}" to "${fixture}"`);
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