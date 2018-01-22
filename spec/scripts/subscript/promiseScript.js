module.exports = [
  {user : 'hi'},
  {bot : 'message #0'},
  () => {
    return Promise.resolve([
      {bot : 'message #1'},
      {bot : 'message #2'},
      {bot : 'message #3'}
    ]);
  },
  {bot : 'message #4'}
]