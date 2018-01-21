var myCustomMessage = 0;
module.exports = [
  {user: 'hi'},
  {bot: 'message #0'},
  {bot: 'message #1'},
  {bot: 'message #2'},
  {
    custom: () => {
      myCustomMessage = '4';
      return Promise.resolve();
    }
  },
  {bot: 'message #3'},
  {bot: function (){
    return Promise.resolve(`message #${myCustomMessage}`);
  }},
  {endConversation:true}
];