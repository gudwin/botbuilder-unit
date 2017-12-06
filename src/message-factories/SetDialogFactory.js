/* jslint es6 */
'use strict';

const SetDialogMessage= require('../messages/SetDialogMessage');

function SetDialogFactory() {

}

SetDialogFactory.produce = function (config, bot, logger ) {
  return new SetDialogMessage( config,bot, logger);
}

module.exports = SetDialogFactory;