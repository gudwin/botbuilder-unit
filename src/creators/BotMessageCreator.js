'use strict';

const BotMessage = require('../messages/BotMessage');

function BotMessageCreator() {

}
BotMessageCreator.factory = function (config, bot, logger ) {
  return new BotMessage( config,bot, logger);
}

module.exports = BotMessageCreator;