const 
  Message = require('./Message'),
  config = require('./config')(),
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  fork = require('child_process').fork;

var queues = new Map();
queues.set('telegram incoming', 'incoming.message.telegram');
queues.set('telegram outgoing', 'outgoing.message.telegram');

// Remember to fetch the foobot url and info from the core GET /info/url
rabbit.init(queues).then(() => {
  queues.forEach((value, key) => {
    console.log(`Subscriber starting for ${value} queue`)
    fork(__dirname + '/subscribe', [key], {silent: false, stdio: 'pipe'});
  });
});