module.exports = [
  {
    "out": "hi"
  },
  {
    "in": "Please type any date",

  },
  {
    "out": "2010-12-23"
  },
  {
    "in": "Your response is:2010-11-23" // https://www.w3schools.com/jsref/jsref_getmonth.asp
  },
  {
    "out": "hi"
  },
  {
    "in": "Please type any date",

  },
  {
    "out": "today"
  },
  {
    "in": function (bot, message, done) {
      let date = new Date();
      date = new Date();
      let expected = `Your response is:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      expect(message.text).toBe(expected);
      done();
    }
  }
];