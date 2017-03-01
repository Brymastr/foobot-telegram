const 
  config = require('./config')(),
  Message = require('./Message'),
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  fork = require('child_process').fork,
  request = require('request-promise');

console.dir(config)
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

const getUrl = request.get(config.foobot_core_url + '/info/webhook');

retry(getUrl, 10, 1000)
  .then(address => telegram.setWebhook(address))
  .then(() => start())

function retry(promise, attempts, interval) {
  return new Promise((resolve, reject) => {
    promise
      .then(body => {
        body = JSON.parse(body);
        if(body.url) resolve(body);
        else throw 'no url';
        resolve(body);
      })
      .catch(err => {
        console.log(err)
        if(attempts === 0) console.warn('Could not connect to foobot');
        else 
          setTimeout(() => {
            console.log(`Error connecting to foobot: attempt ${11-attempts}/10`);
            return retry(promise, --attempts, interval).then(resolve);
          }, interval);
      });
  });
}