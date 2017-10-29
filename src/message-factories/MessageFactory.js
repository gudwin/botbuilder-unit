const BotMessageFactory = require('./BotMessageFactory');
const UserMessageFactory = require('./UserMessageFactory');

function MessageFactory( ) {

}
MessageFactory.produce = function ( config, bot , logReporter ) {
  let isBot = ("undefined" != typeof config.bot) || config.endConversation || config.typing;
  if ( isBot  ) {
    return BotMessageFactory.produce( config, bot, logReporter );
  }
  let isUser = "undefined" != typeof config.user;
  if (  isUser ) {
    return UserMessageFactory.produce(config, bot, logReporter )
  }
  throw new Error(`Unsupported config - ${JSON.stringify(config)}`);

}
module.exports = MessageFactory;