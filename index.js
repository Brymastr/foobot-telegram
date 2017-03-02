const 
  config = require('./config')(),
  Message = require('./Message'),
  rabbit = require('amqplib'),
  telegram = require('./telegram'),
  fork = require('child_process').fork,
  request = require('request-promise');

// Queues to subscribe to
const queues = new Map();
queues.set('telegram', '*.message.telegram');

const checkExchangePromise = () => new Promise((resolve, reject) => {
  rabbit.connect(config.rabbit_url).then(conn => {
    return conn.createChannel().then(channel => {
      return channel.checkExchange(config.rabbit_exchange)
        .then(ok => channel.close());
    })
    .then(() => conn.close())
    .then(resolve);
  });
});

const createQueuesPromise = (channel, name, key) => {
  return new Promise(resolve => {
    channel.assertQueue(name)
      .then(queue => channel.bindQueue(queue.queue, config.rabbit_exchange, key)
      .then(resolve));
  });
};

const queuePromise = () => new Promise((resolve, reject) => {
  rabbit.connect(config.rabbit_url).then(conn => {
    return conn.createChannel().then(channel => {
      let promises = [];
      queues.forEach((routeKey, queueName) => {
        promises.push(createQueuesPromise(channel, queueName, routeKey));
      });
      return Promise.all(promises).then(() => channel.close());
    })
    .then(() => conn.close())
    .then(resolve);
  });
});

const queueConnectionPromise = () => rabbit.connect(config.rabbit_url);

const getUrl = () => request.get(config.foobot_core_url + '/info/webhook');

const start = () => {
  queues.forEach((value, key) => {
    console.log(`Subscriber starting for ${key} queue`);
    fork(__dirname + '/subscribe', [key], {silent: false, stdio: 'pipe'});
  });
};

retry(queueConnectionPromise, 'connect to rabbit at' + config.rabbit_url, 10, 15000)
  .then(conn => retry(checkExchangePromise, 'check exchange', 5, 5000))
  .then(exchange => {
    const promises = [
      retry(queuePromise, 'create queues'),
      retry(getUrl, 'get url from core', 10, 5000)
    ];
    
    Promise.all(promises).then(() => start());
  });
  
/**
 * Retry a promise
 */
function retry(promise, message, attempts = 5, interval = 500) {
  return new Promise((resolve, reject) => {
    promise().then(resolve).catch(err => {
      console.log('errorrrrr: ' + err.message);
      if(attempts === 0) throw new Error('Max retries reached for ' + message);
      else setTimeout(() => {
        console.log('retry ' + message);
        return retry(promise, message, --attempts, interval).then(resolve);
      }, interval);
    });
  });
}