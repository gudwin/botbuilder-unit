const unit = require('../../');
module.exports = {
  successExpected: function (bot, script,done) {
    unit(bot, script).then(() => {
      done();
    }, (err) => {
      fail(err)
      done();
    })
  },
  errorExpected: function (bot, script, done, error,optionalErrorFunc ) {
    unit(bot,script).then(() => {
      fail('Impossible case');
      done();
    },(error) => {
      if ( optionalErrorFunc ) {
        optionalErrorFunc.call(null, error, done);
      }
      done();
    })
  }
}