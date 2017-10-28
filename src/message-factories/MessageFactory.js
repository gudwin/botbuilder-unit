const BotMessageFactory = require('./BotMessageFactory');
const UserMessageFactory = require('./UserMessageFactory');

function MessageFactory( ) {

}
MessageFactory.produce = function ( config, bot , logger ) {
  if ( config.bot || config.endConversation || config.typing ) {
    return BotMessageFactory.produce( config, bot, logger );
  }
  if ( config.user ) {
  }
  return UserMessageFactory.produce(config, bot, logger )
  throw new Error(`Unsupported config - ${JSON.stringify(config)}`);

}
module.exports = MessageFactory;