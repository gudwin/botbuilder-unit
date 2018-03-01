"use strict";

var async = require("async");

const botbuilder = require('botbuilder');
var readline = require("readline");

class TestConnector {
  processMessage(message) {
    if (this.onEventHandler) {
      var msg = new botbuilder.Message()
        .address({
          channelId: 'console',
          user: {id: 'user', name: 'User1'},
          bot: {id: 'bot', name: 'Bot'},
          conversation: {id: 'Convo1'}
        })
        .timestamp()
        .text(message);
      this.onEventHandler([msg.toMessage()]);
    }
    return this;
  }


  onEvent(handler) {
    this.onEventHandler = handler;
  }


  send(messages, done) {
    var _this = this;
    var addresses = [];
    async.forEachOfSeries(messages, function (msg, idx, cb) {
      if (msg.type == 'message') {
        var adr = Object.assign({},msg.address);
        adr.id = idx.toString();
        addresses.push(adr);
        cb(null);
      }
      else {
        cb(null);
      }
    }, function (err) {
      return done(err, !err ? addresses : null);
    });
  }

}

module.exports = TestConnector;