# botbuilder-unit

**Unfortunately, development just started and documentation is not ready. So, please study tests specifications.** 


## Requied Actions
- [ ] Complete message configuration section
- [ ] Complete script configuration section 
- [ ] Complete global configuration section
- [ ] Update a Quick Start Section (remove Jasmine)
- [ ] Describe BaseLogReporter interface
- [ ] Provide an example for the ConversationMock class
 
## Glossary
- **script** or **conversation spec** - an array of messages describing flow of conversation with a bot;

This Library allows to apply unit testing to Microsoft Bot Framework Chatbots. 
The Library simulates conversation between bot and the end user. 

As input the Library requires a bot and a script

# Quick Start

## Install library

`npm install --save-dev botbuilder-unit`

## Create Test Script

File **"test-script.js"**:
```javascript
const unit = require('botbuilder-unit');
const builder = require('botbuilder');

// This array, also called a script. It will be used to validate conversation with user
let script = [
  {
    "user": "hi"
  },
  {
    "bot": "How should I call you?"
  },
  {
    "user": "Timmy"
  },
  {
    "bot": "Nice to meet you, \"Timmy\"!"
  }
];

// Setting up a bot
let connector = new builder.ConsoleConnector().listen();
bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  session => builder.Prompts.text(session, 'How should I call you?'),
  (session, response) => session.endDialog(`Nice to meet you, ${JSON.stringify(response.response)}!`)
]);

// Executing test
unit(bot, script, {
  title: 'Your first test script',
  reporter : new unit.BeautyLogReporter() // Display log in messenger-like style, with colors
}).then(() => {
  // If test finished successfully
  console.log('Script passed');
  process.exit();
}, (err)  => {
  console.error(err);
})

```

## Execute Script
 ```node ./test-script.js```
 
At the end you will see next result:
 ![Script output for sample script](https://github.com/gudwin/botbuilder-unit/blob/master/examples/example-of-beauty-log.png?raw=true)
 
#  Installation

`npm install --save-dev botbuilder-unit`

# Configuration

## Global options

Global options will be applied to every script that will be processed by library. There are two ways to setup a global option:
- as an environment variable, Library will autoload it during startup;
- as an attribute of _config_ object exposed in _module.exports_ section of The Library; 
 
### As an Environment Variable

- **BOTBUILDERUNIT_TEST_TIMEOUT** - timeout for script execution in milliseconds
- **BOTBUILDERUNIT_REPORTER** - logging style, supported values: _empty_, _plain_ and _beauty_

For example, to run script with 10 seconds timeout and beautified output you need to execute something like: 
`export BOTBUILDERUNIT_REPORTER=beauty; export BOTBUILDERUNIT_TEST_TIMEOUT=10000; npm test`

### As a part of the Library module.exports

The library exposes `config` object in module.exports. Properties of an object:
- **timeout** - timeout for script execution in milliseconds
- **reporter** - the instance of reporting class. Default value: _new PlainLogReporter()_. Classes provided by library:
  - **PlainLogReporter**, default, will output text messages in console 
  - **EmptyLogReporter**, nothing will be sent to output
  - **PlainLogReporter**, colored and styled output, useful for long scripts 

## Script level

The Script is just an array with simple objects (at this version) where every item represents a message in conversation between user and the bot. The Library supposes that first message **always be** from user. That issue will be fixed in future fixes.

If the message is from the user, than message object should look like this:

```javascript
{
    "user" : "Hey there!"
}
```

In case, if the message is from the bot, than:
 
```javascript
{
    "bot" : "Hello world!"
}
```
 
### Example of the Script

```javascript
[
    {
        "user" : "Hi"
    },
    {
        "bot" : "Welcome back!"
    },
    {
        "bot" : "Hey, now early morning"
    }
    {
        "bot" : "Should I prepare a double of coffee for you?"
    }
]
```

# Mocking conversation
 
 If you want to "prototype" conversation flow and see how it looks and feels and only after that to start actual development, than you will need **ConversationMock** class. 
 There is a class that allow you to quickly build conversation flows and integrate them with conversation specs.   

## ConversationMock 

### new ConversationMock( steps ) 
 Where **steps** is an array of standard waterfall dialog functions. Each step will be executed only once. The Library will pass standard arguments: __session__, __arguments__,__next__ into step.  
 
### ConversationMock.prototype
 
- **getListener()** returns a listener for WaterfallDialog. Once the listener executed the first step will be executed, and will move internal pointer to a next step. Second call will execute second step callback and so on...

### ConversationMock static methods
- **sendMessagesStep( messages, afterFunc)** - Creates a step for waterfall dialog. Arguments:
  - **messages** argument is an array of strings, these messages will be sent to user; 
  - **afterFunc**__(session, args, next)__ is a callback, will be called after messages will be sent.  

# Changelog
- 0.4.2 - new static method for ConversationMock class - sendMessagesStep, minor fixes   
- 0.4.0 - new output log, global options support
- 0.3.0 - timeout support, minor fixes
- 0.2.3 - fixed error with case then multiple messages from users awaited
- 0.2.2 - updated error messages in case if current message in script does not matching pattern for a bot's message
- 0.2.0 - removed ambiguity with user and bot messages, using "user" and "bot" instead of "out" and "in"
- 0.1.0 - initial version
