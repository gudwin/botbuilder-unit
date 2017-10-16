'use strict';

const UserMessage = require('../messages/UserMessage');

function UserMessageCreator() {

}
UserMessageCreator.factory = function ( config, bot, logger ) {
  return new UserMessage( config, bot, logger, bot.connector('console'));
}

module.exports = UserMessageCreator;