const 
  config = require('./config')(),
  Message = require('./Message'),
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  fork = require('child_process').fork,
  request = require('request-promise');

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
};

const getUrl = request.get(config.foobot_core_url + '/info/webhook').then(body => {
  body = JSON.parse(body);
  if(body.url) resolve(body);
  else throw 'no url';
});

retry(getUrl, 'get url from core', 10, 5000)
  .then(telegram.setWebhook)
  .then(() => start());

/**
 * Retry a promise
 */
function retry(promise, message, attempts = 5, interval = 500) {
  return new Promise((resolve, reject) => {
    promise.then(resolve).catch(err => {
      console.log(err)
      if(attempts === 0) throw new Error('Max retries reached for ' + message);
      else setTimeout(() => {
        console.log('retry ' + message);
        return retry(promise, message, --attempts, interval).then(resolve);
      }, interval);
    });
  });
}