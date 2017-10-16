const botFactory = require('./botFactory');
const unit = require('../');
describe('Timeout test suite', function () {
  let script = require('./scripts/timeout');
  let bot = null;

  beforeEach((done) =>{
    try {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
      bot = botFactory();
      bot.dialog('/test', [
        (session,args,next) => {
          session.send('Test dialog welcomes you!')
          next();
        },
        (session) => {
          setTimeout(() => {
            session.endDialog('End of test dialog')
          }, 2000)
        }
      ])
    } catch (e ) {
      console.log(e );
    }
    done();
  });
  it('Should support `timeout` field, will fail if timeout exceeded', (done) => {
    unit(bot, script, {timeout: 1000})
      .then(() => {
        fail('Impossible call');
        done();
      })
      .catch( done )
  });
  it('Test finishes successfully, if timeout not exceed', (done) => {
    unit(bot, script, {timeout: 3000})
      .then(done)
      .catch((err) => {
        fail('Impossible call');
        done();
      })
  });
  it('If timeout not specified, library will wait', (done) => {
    unit(bot, script).then(done);
  })
})