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
    "in": "Your response is:2010-12-23"
  },
  {
    "out": "hi"
  },
  {
    "in": "Please type any date",

  },
  {
    "out": "now"
  },
  {
    "in": function ( bot, message, done) {
      let date = session.dialogData.response;
      let expected = `Your response is:${date.getYear()}-${date.getMonth()}-${date.getDate()}`;
      expect(session.dialogData.response).toBe( expected);
      done();
    }
  }
];