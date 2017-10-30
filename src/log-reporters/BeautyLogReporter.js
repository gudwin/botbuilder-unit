const BaseLogReporter = require('./BaseLogReporter');
const util = require('util');
const colors = require('colors');


const MIN_COLUMNS_PER_ROW = 40;
const EMPTY_FINAL_REPORT = {
  firstErrorOnStep: false,
  totalSteps: 0,
  warnings: false
}

function BeautyLogReporter() {
  this.columnsPerRow = 0;
  this.contentColumnsPerRow = 0;
  this.isLeftPaddingEnabled = false;
  BaseLogReporter.call(this);
}
BeautyLogReporter.prototype = Object.create(BaseLogReporter.prototype);
BeautyLogReporter.prototype.constructor = BeautyLogReporter;


BeautyLogReporter.prototype.refreshDimensions = function (msg) {
  this.columnsPerRow = Math.max(process.stdout.columns, MIN_COLUMNS_PER_ROW);
  this.contentColumnsPerRow = Math.floor(2 / 3 * this.columnsPerRow);
}
BeautyLogReporter.prototype.inspect = function (message) {
  return util.inspect(message, {depth: 4, color: true, showHidden: true})
}
BeautyLogReporter.prototype.outputCentralized = function (msg, colorFunc) {
  if (!colorFunc) {
    colorFunc = colors.black;
  }
  this.refreshDimensions(msg)
  let offset1 = Math.floor((this.columnsPerRow - msg.length) / 2);
  let offset2 = this.columnsPerRow - offset1 - msg.length;
  let result = '='.repeat(offset1) + msg + '='.repeat(offset2);
  console.log();
  console.log(colorFunc(result));
  console.log();
}
BeautyLogReporter.prototype.log = function (msg, colorFunc) {
  if (this.isLeftPaddingEnabled) {
    if (this.columnsPerRow > msg.length) {
      msg = ' '.repeat(this.columnsPerRow - msg.length) + msg;
    }
  }
  console.log(colorFunc(msg));
}
BeautyLogReporter.prototype.getDate = function () {
  let date = new Date();
  return date.toTimeString().split(' ')[0];
}
BeautyLogReporter.prototype.outputMessageBox = function (step, msg, title, colorFunc) {
  this.refreshDimensions(msg);
  let lines = msg.split("\n");

  this.log('#' + step + ' ' + this.getDate() + `, ${title}`, colors.black);
  this.log(('+' + '-'.repeat(this.contentColumnsPerRow - 2) + '+'), colorFunc);
  lines.forEach((item) => {
    this.wrap(item, colorFunc);
  })
  this.log(('+' + '-'.repeat(this.contentColumnsPerRow - 2) + '+'), colorFunc);
}
BeautyLogReporter.prototype.wrap = function (msg, colorFunc) {
  let moreThanOnce = false;
  while (msg.length > 0) {
    let chunk = msg.substr(0, this.contentColumnsPerRow - 4);
    if (chunk.length < this.contentColumnsPerRow - 4) {
      chunk = chunk + ' '.repeat(this.contentColumnsPerRow - 4 - chunk.length);

    } else {
    }
    chunk = '| ' + chunk + ' |';

    msg = msg.substr(this.contentColumnsPerRow - 4);
    this.log(chunk, colorFunc);
  }

}

// ---------------------------------------------------------------------------------------------------------------------
// Base Reporter Inherited methods

BeautyLogReporter.prototype.newScript = function (messages, scriptName) {
  this.finalReport = Object.assign({}, EMPTY_FINAL_REPORT);
  if (scriptName) {
    this.outputCentralized(`NEW SCRIPT: ${scriptName.toUpperCase()}`, colors.blue);
  }

  this.finalReport.totalSteps = messages.length;
  BaseLogReporter.prototype.newScript.call(this, messages);
}
BeautyLogReporter.prototype.scriptFinished = function (step) {
  this.isLeftPaddingEnabled = false;
  if (false !== this.finalReport.firstErrorOnStep) {
    console.log('-=-');
    console.log(this.finalReport);
    this.outputCentralized(' SCRIPT FINISHED WITH ERRORS ', colors.red);
    this.log(`Completed / Total steps: ${this.finalReport.firstErrorOnStep}/${this.finalReport.totalSteps}`, colors.red)
  } else if (this.finalReport.warnings) {
    this.outputCentralized(' SCRIPT FINISHED WITH WARNINGS', colors.yellow);
    this.log(`Completed / Total steps: ${step+1}/${this.finalReport.totalSteps}`, colors.yellow);
  } else {
    this.outputCentralized(' SCRIPT FINISHED SUCCESSFULLY', colors.green);
    this.log(`Completed / Total steps: ${step+1}/${this.finalReport.totalSteps}`, colors.green);
  }

}
BeautyLogReporter.prototype.messageReceived = function (step, message) {
  let outputMessage = message.text ? message.text : this.inspect(message);
  this.isLeftPaddingEnabled = false;

  this.outputMessageBox(step, outputMessage, 'Bot wrote:', colors.blue);
}
BeautyLogReporter.prototype.endConversation = function (step) {
  this.outputCentralized(` STEP #${step}, END OF CONVERSATION `, colors.blue);
}
BeautyLogReporter.prototype.typing = function (step) {
  this.outputCentralized(` STEP #${step}, TYPING ... `, colors.blue);
}
BeautyLogReporter.prototype.messageSent = function (step, message) {
  let outputMessage = '';
  if ("function" == typeof message.user) {
    outputMessage = message.user.toString();
  } else {
    outputMessage = message.user ? message.user : this.inspect(message);
  }

  this.isLeftPaddingEnabled = true;
  this.outputMessageBox(step, outputMessage, 'User wrote:', colors.green);
}
BeautyLogReporter.prototype.expectationError = function (step, received, expected) {
  if (false === this.finalReport.firstErrorOnStep) {
    this.finalReport.firstErrorOnStep = step;
    this.finalReport.error = expected;
  }
  this.outputCentralized(`EXPECTATION ERROR ON STEP #${step}`, colors.red)
  let expectedErrorMsg = expected.bot ? expected.bot : this.inspect(( expected ));
  this.outputMessageBox(step, expectedErrorMsg, 'Expected Message:', colors.red);
}
BeautyLogReporter.prototype.error = function (step, message) {
  if (false === this.finalReport.firstErrorOnStep) {
    this.finalReport.firstErrorOnStep = step;
    this.finalReport.error = message;
  }
  this.outputCentralized(`ERROR ON STEP #${step}`, colors.red);
  console.log(colors.red(this.inspect(message)));
  this.isLeftPaddingEnabled = false;
}
BeautyLogReporter.prototype.warning = function (step, message) {
  this.finalReport.warnings = true;
  this.outputCentralized(`WARNING ON STEP #${step}`, colors.yellow);
  console.log(colors.yellow(message));
}
BeautyLogReporter.prototype.info = function (step, message) {
  this.outputCentralized(`INFO ON STEP #${step}`, colors.yellow);
  console.log(colors.yellow(this.inspect(message)));
}


module.exports = BeautyLogReporter;