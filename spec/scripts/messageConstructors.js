module.exports = [
  {
    "out": "hi"
  },
  {
    "in": 'Say hello?'
  },
  {
    "out": function ( bot, session, done) {
      done('Hello world!');
    }
  },
  {
    "in": function ( bot, session, done) {
      expect(session.message.text).toBe('You typed: Hello world!');
      done();
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