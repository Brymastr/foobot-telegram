const 
  config = require('./config')(),
  rabbit = require('amqplib');

exports.init = queues => {
  return new Promise((resolve, reject) => {
    this.connect()
      .then(connection => connection.createChannel())
      .then(channel => {
        let promises = [];
        queues.forEach((routeKey, queueName) => {
          promises.push(this.queuePromise(channel, queueName, routeKey));
        });
        return Promise.all(promises).then(() => channel);
      })
      .then(channel => channel.close())
      .then(resolve);
  });
}

this.queuePromise = (channel, name, key) => {
  return new Promise(resolve => {
    channel.assertQueue(name)
      .then(queue => channel.bindQueue(queue.queue, config.rabbit_exchange, key)
      .then(resolve));
  });
};

exports.connect = () => {
  return new Promise((resolve, reject) => {
    rabbit.connect(config.rabbit_url).then(resolve);
  });
};

// Publish to RabbitMQ with a given topic
exports.pub = (connection, routingKey, message) => {
  // console.log('Publish message.', routingKey, message.text);
  return new Promise((resolve, reject) => {
    connection.createChannel().then(channel => {
      channel.publish(config.rabbit_exchange_name, routingKey, new Buffer(JSON.stringify(message)));
      return channel.close();
    }).then(resolve);
  });
}