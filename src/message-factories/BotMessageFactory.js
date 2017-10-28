'use strict';

const BotMessage = require('../messages/BotMessage');

function BotMessageFactory() {

}

BotMessageFactory.produce = function (config, bot, logger ) {
  return new BotMessage( config,bot, logger);
}

module.exports = BotMessageFactory;