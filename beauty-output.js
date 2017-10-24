var colors = require('colors');
const MIN_COLUMNS_PER_ROW = 40;
function BeautyLogReporter() {
  this.columnsPerRow = 0;
  this.contentColumnsPerRow = 0;
  this.isLeftPaddingEnabled = false;
  this.step = 0;
}
BeautyLogReporter.prototype.refreshDimensions= function (msg) {
  this.columnsPerRow = Math.max(process.stdout.columns, MIN_COLUMNS_PER_ROW);
  this.contentColumnsPerRow = Math.floor(2 / 3 * this.columnsPerRow);
  if (this.contentColumnsPerRow > msg.length + 4 ) {
    this.contentColumnsPerRow = msg.length + 4;
  }
}
BeautyLogReporter.prototype.outputUser= function (msg) {
  this.isLeftPaddingEnabled = true;
  this.refreshDimensions(msg);
  this.outputMessageBox( msg, 'User', colors.green);
  this.step++;
}
BeautyLogReporter.prototype.outputBot= function (msg) {
  this.isLeftPaddingEnabled = false;
  this.refreshDimensions(msg);
  this.outputMessageBox( msg, 'Bot', colors.blue );;

  this.step++;
}
BeautyLogReporter.prototype.outputEndConversation= function ( msg ) {
  let offset1 = Math.floor((this.columnsPerRow - 21) / 2);
  let offset2 = this.columnsPerRow - offset1 - 21;
  let result = '='.repeat(offset1) + ' END OF CONVERSATION ' + '='.repeat(offset2);
  console.log();
  console.log(result.black)
  console.log();
}
BeautyLogReporter.prototype.outputMessageBox= function (msg, title, colorFunc) {
  this.log('#' + this.step + ' ' + this.getDate() + `, ${title} wrote:`, colors.black);
  this.log(('+' + '-'.repeat(this.contentColumnsPerRow - 2) + '+'),colorFunc);
  this.wrap( msg, colorFunc );
  this.log(('+' + '-'.repeat(this.contentColumnsPerRow - 2) + '+'),colorFunc);
}
BeautyLogReporter.prototype.wrap= function (msg,colorFunc) {
    let moreThanOnce = false;
    while (msg.length > 0) {
      let chunk = msg.substr( 0, this.contentColumnsPerRow - 4 );
      if ( chunk.length < this.contentColumnsPerRow - 4 ) {
        chunk = chunk + ' '.repeat(this.contentColumnsPerRow- 4 - chunk.length) ;

      } else {
      }
      chunk = '| ' + chunk + ' |';

      msg = msg.substr( this.contentColumnsPerRow - 4 );
      this.log(chunk,colorFunc);
    }

}

BeautyLogReporter.prototype.log= function (msg, colorFunc) {

  if ( this.isLeftPaddingEnabled) {
    if ( this.columnsPerRow > msg.length ) {
      msg = ' '.repeat(this.columnsPerRow - msg.length) + msg;
    }
  }
  //console.log(msg.length);
  console.log(colorFunc(msg));
}
  BeautyLogReporter.prototype.getDate =function () {
  let date = new Date();
  return date.toTimeString().split(' ')[0];
}


let logger = new BeautyLogReporter();

logger.outputUser('Hi')

// Display short user message
logger.outputBot('Hello, Gisma!');
logger.outputUser('What do we have today?');
logger.outputBot('Plans for today:');
logger.outputBot('- fix reporting in concur');
logger.outputBot('- update botbuilder-unit');
logger.outputBot('- finish WK');
logger.outputBot('- read Bacardi docs');
// Display long message form user, that has to be wrapped
logger.outputUser('Got that, than I have to say that we are changing plans! We have to switch to Drupal Open Day first, and then close concur issue');
logger.outputBot('Well, I have to say that even a superlong conversation is a not big problem for me. So go on, please proceed with future requiests');
logger.outputEndConversation();
// Display short bot message
// Display bot multiline message
// Display user multiline message
// Display session message
// Display endMessage
// Display failed to match bot message
// Display failed to match user message
// Display failed order case bot instead of user message
// Display failed order case when user instead of bot received

