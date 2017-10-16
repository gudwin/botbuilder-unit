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
module.exports = ConversationMock;