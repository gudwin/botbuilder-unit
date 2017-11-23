/*var colors = require('colors');
const MIN_COLUMNS_PER_ROW = 40;
function BeautyLogReporter() {
  this.columnsPerRow = 0;
  this.contentColumnsPerRow = 0;
  this.isLeftPaddingEnabled = false;
  this.step = 0;
}
BeautyLogReporter.prototype.refreshDimensions = function (msg) {
  this.columnsPerRow = Math.max(process.stdout.columns, MIN_COLUMNS_PER_ROW);
  this.contentColumnsPerRow = Math.floor(2 / 3 * this.columnsPerRow);
  if (this.contentColumnsPerRow > msg.length + 4) {
    this.contentColumnsPerRow = msg.length + 4;
  }
}
BeautyLogReporter.prototype.outputUser = function (msg) {
  this.isLeftPaddingEnabled = true;
  this.refreshDimensions(msg);
  this.outputMessageBox(msg, 'User wrote:', colors.green);
  this.step++;
}
BeautyLogReporter.prototype.outputBot = function (msg) {
  this.isLeftPaddingEnabled = false;
  this.refreshDimensions(msg);
  this.outputMessageBox(msg, 'Bot wrote:', colors.blue);
  ;

  this.step++;
}
BeautyLogReporter.prototype.outputCentralized = function (msg, colorFunc) {
  if (!colorFunc) {
    colorFunc = colors.black;
  }
  let offset1 = Math.floor((this.columnsPerRow - msg.length) / 2);
  let offset2 = this.columnsPerRow - offset1 - msg.length;
  let result = '='.repeat(offset1) + msg + '='.repeat(offset2);
  console.log();
  console.log(colorFunc(result));
  console.log();
}
BeautyLogReporter.prototype.outputEndConversation = function (msg) {

  this.outputCentralized(' END OF CONVERSATION ')

}
BeautyLogReporter.prototype.outputScriptFinished = function (msg) {
  this.outputCentralized(' END OF SCRIPT ', colors.yellow);
}
BeautyLogReporter.prototype.outputMessageBox = function (msg, title, colorFunc) {
  this.log('#' + this.step + ' ' + this.getDate() + `, ${title}`, colors.black);
  this.log(('+' + '-'.repeat(this.contentColumnsPerRow - 2) + '+'), colorFunc);
  this.wrap(msg, colorFunc);
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

BeautyLogReporter.prototype.log = function (msg, colorFunc) {

  if (this.isLeftPaddingEnabled) {
    if (this.columnsPerRow > msg.length) {
      msg = ' '.repeat(this.columnsPerRow - msg.length) + msg;
    }
  }
  //console.log(msg.length);
  console.log(colorFunc(msg));
}
BeautyLogReporter.prototype.outputExpectationError = function (received, expected) {
  this.isLeftPaddingEnabled = false;
  this.outputCentralized(`ERROR ON STEP ${this.step} ENCOUNTERED`, colors.red)
  this.refreshDimensions(received);
  this.outputMessageBox(received, 'Bot wrote:', colors.red);
  this.refreshDimensions(expected);
  this.outputMessageBox(expected, 'Expected Message:', colors.blue);

}
BeautyLogReporter.prototype.getDate = function () {
  let date = new Date();
  return date.toTimeString().split(' ')[0];
}*/

const BeautyLogReporter = require('../src/log-reporters/BeautyLogReporter');
const PlainLogReporter = require('../src/log-reporters/PlainLogReporter');

let script = [
  {user: 'Hi'},
  {bot: 'Hello, Gisma!'},
  {user: 'What do we have for today?'},
  {bot: 'Plans for today:'},
  {bot: '- fir reporting in concur'},
  {bot: '- update botbuilder-unit'},
  {bot: '- preparare report about annotator problem'},
  {bot: '- read Bacardi docs'},
  {user: 'Got that, than I have to say that we are changing plans! We have to switch to Drupal Open Day first, and then close concur issue'},
  {bot: 'Well, I have to say that even a superlong conversation is a not big problem for me. So go on, please proceed with future requiests'},
  {endConversation: true},
  {bot: 'Of I forgot to mention'}
]
let logger = new PlainLogReporter();
//let logger = new BeautyLogReporter();
logger.newScript(script);
logger.messageSent(0, script[0])
logger.messageReceived(1, script[1]);
logger.messageSent(2, script[2]);
logger.messageReceived(3, script[3]);
logger.messageReceived(4, script[4]);
logger.messageReceived(5, script[5]);
logger.messageReceived(6, script[6]);
logger.messageReceived(7, script[7]);
logger.messageSent(8, script[8]);
logger.messageReceived(9, script[9]);
logger.endConversation(10);
logger.scriptFinished(12);
logger.expectationError(11, {bot: 'I want to add...'}, script[11]);
logger.warning(12, 'Some important information to notice!');
logger.error(12, {customError: 'Oh, well! I just happenned...'});
logger.info(13, {a:1,b:2,text: 'Oh, well! I just happenned...'})
logger.startupDialog(14, '/startup/',{a:1,b:2,text: 'Oh, well! I just happenned...'});
logger.session(15, {
  conversationData : {
    a : 'b'
  },
  userData : {
    c : 'd'
  },
  privateConversationData : {
    x : 'y'
  },
  sessionState : 1
})