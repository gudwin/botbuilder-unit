process.on('uncaughtException', function (exception) {
  console.log(exception);
});
process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});


var jasmine = new Jasmine();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
jasmine.loadConfigFile('./spec/support/jasmine.json');
jasmine.configureDefaultReporter({
  showColors: true
});


var Reporter = require('jasmine-terminal-reporter');
var reporter = new Reporter({
  isVerbose : true,
  includeStackTrace : true
})
jasmine.addReporter( reporter );
jasmine.execute();