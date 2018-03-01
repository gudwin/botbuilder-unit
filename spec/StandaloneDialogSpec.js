const unit = require('../');

describe('Standalone dialogs, ', function () {
  it('test that other type except function, array and childs on UniversalObjectare not permitted', (done) => {
    let script = [{user: 'hi'}];
    try {
      unit(1,script);
    } catch (e ) {
      done();
    }

  })
  it('test that function will be treated as dialog', (done) => {
    let script = [
      {user: 'hi!'},
      {bot: 'hello'},
      {user: 'say something'},
      {bot: 'Hello World!'}
    ]
    let attempt = 0;
    let dialog = function (session) {
      if (!attempt) {
        attempt++;
        session.endDialog('hello');
      } else {
        session.endDialog('Hello World!');
      }
    }
    unit(dialog, script).then(done);
  })
  it('test with array, library treats it as a dialog', (done) => {
    let script = [
      {user: 'hi!'},
      {bot: 'hello'},
      {user: 'say something'},
      {bot: 'Hello World!'}
    ]
    let attempt = 0;
    let dialog = [
      (session, args, next) => {
        if (!attempt) {
          attempt++;
          session.endDialog('hello');
        } else {
          next();
        }
      },
      (session) => {
        session.endDialog('Hello World!');
      }
    ]
    unit(dialog, script).then(done);
  });
})