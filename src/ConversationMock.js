function ConversationMock(steps) {
  this.steps = steps;
  this.currentStep = 0;

}
ConversationMock.prototype.getListener = function ( ) {
  return (session, args, next) => {
    if ( this.currentStep > this.steps.length) {
      throw new Error("Out of range for mocked steps  ");
    }
    let step = this.steps[this.currentStep];
    this.currentStep++;
    step(session,args,next);

  };
}

/**
 * Creates a step for waterfall dialog
 * @param messages array, these messages will be sent to user
 * @param afterFunc callable, will be called after messages will be sent
 * @returns {Function}
 */
ConversationMock.sendMessagesStep = function (messages, afterFunc) {
  return (session, args, next) => {
    messages.forEach((item) => {
      session.send(item);
    });
    if (afterFunc) {
      console.log(afterFunc.toString());
      afterFunc.call(this, session, args, next)
    }
  };
}
module.exports = ConversationMock;