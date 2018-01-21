var myCustomMessage = 0;
module.exports = [
  {user: 'hi'},
  {bot: 'message #0'},
  {bot: 'message #1'},
  {bot: 'message #2'},
  {
    custom: () => {
      return Promise.reject('The test failed');
    }
  }
];