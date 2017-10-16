const BotMessageCreator = require('./creators/BotMessageCreator');
const UserMessageCreator = require('./creators/UserMessageCreator');

function MessageFactory( ) {

}
MessageFactory.factory = function ( config, bot , logger ) {
  if ( config.bot || config.endConversation || config.typing ) {
    return BotMessageCreator.factory( config, bot, logger );
  }
  if ( config.user ) {
    return UserMessageCreator.factory(config, bot, logger )
  }
  throw new Error(`Unsupported config - ${JSON.stringify(config)}`);

}
module.exports = MessageFactory;