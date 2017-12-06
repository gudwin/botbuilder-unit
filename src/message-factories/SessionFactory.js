/* jslint es6 */
'use strict';

const SessionMessage = require('../messages/SessionMessage');

function SessionMessageFactory() {

}

SessionMessageFactory.produce = function (config, bot, logger ) {
  return new SessionMessage( config,bot, logger);
}

module.exports = SessionMessageFactory;