/* jslint es6 */
'use strict';


const builder = require('botbuilder');

module.exports = function () {
  let bot = new builder.UniversalBot();
  bot.dialog('/', function (session) {
    session.beginDialog('/test');
  })
  return bot;
}