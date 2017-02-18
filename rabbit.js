const 
  config = require('./config')(),
  rabbit = require('amqplib');

exports.init = (queues) => {
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

exports.createChannel = () => Promise.resolve(connection.createChannel());

// Subscribe messages from RabbitMQ
exports.sub = (channel, queue) => {
  return new Promise((resolve, reject) => {
    channel.consume(queue, message => {
      if(!message.consumerTag) channel.ack(message);
      resolve(JSON.parse(message.content.toString()));
    });
  });
};

// Publish to RabbitMQ with a given topic
exports.pub = (routingKey, message) => {
  return new Promise((resolve, reject) => {
    this.createChannel().then(channel => {
      channel.publish(config.rabbit_exchange_name, routingKey, new Buffer(JSON.stringify(message)))
      return channel.close();
    }).then(resolve);
  });
}