const 
  Message = require('./Message'),
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  fork = require('child_process').fork,
  request = require('request-promise'),
  config = require('./config')();

// Queues to subscribe to
var queues = new Map();
queues.set('telegram', '*.message.telegram');

const start = () => {
  rabbit.init(queues).then(() => {
    queues.forEach((value, key) => {
      console.log(`Subscriber starting for ${key} queue`)
      fork(__dirname + '/subscribe', [key], {silent: false, stdio: 'pipe'});
    });
  });
}

// Remember to fetch the foobot url and info from the core GET /info/url
request.get(config.foobot_core_url + '/info/webhook', null)
  .then(body => telegram.setWebhook(JSON.parse(body)))
  .then(() => start());