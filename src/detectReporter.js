const PlainLogReporter = require('./log-reporters/PlainLogReporter');
const EmptyLogReporter = require('./log-reporters/EmptyLogReporter');
const BeautyLogReporter = require('./log-reporters/BeautyLogReporter');


module.exports = function detectReporter(key) {
  switch (key) {
    case 'beauty':
      return (new BeautyLogReporter());
    case 'empty' :
      return (new EmptyLogReporter());
    case 'plain' :
    default:
      return (new PlainLogReporter());
  }
}
