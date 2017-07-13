module.exports = [
  {
    "user": "hi"
  },
  {
    "bot": "Please type any date",

  },
  {
    "user": "2010-12-23"
  },
  {
    "bot": "Your response is:2010-11-23" // https://www.w3schools.com/jsref/jsref_getmonth.asp
  },
  {
    "user": "hi"
  },
  {
    "bot": "Please type any date",

  },
  {
    "user": "today"
  },
  {
    "bot": function (bot, message, done) {
      let date = new Date();
      date = new Date();
      let expected = `Your response is:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      expect(message.text).toBe(expected);
      done();
    }
  }
];