'use strict';

const UserMessage = require('../messages/UserMessage');

function UserMessageFactory() {

}
UserMessageFactory.produce = function ( config, bot, logger ) {
  return new UserMessage( config, bot, logger, bot.connector('console'));
}

module.exports = UserMessageFactory;