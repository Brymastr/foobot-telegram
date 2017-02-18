const 
  config = require('./config')(),
  rabbit = require('amqplib');

var connection;

exports.init = () => {
  return new Promise((resolve, reject) => {
    this.connect()
      .then(() => this.createChannel())
      .then(channel => {
        return channel.assertQueue(config.rabbit_telegram_queue)
          .then(queue => channel.bindQueue(queue.queue, config.rabbit_exchange, 'incoming.message.telegram'))
          .then(queue => channel.close());
      })
      .then(resolve);
  });
}

exports.connect = () => {
  return new Promise((resolve, reject) => {
    rabbit.connect(config.rabbit_url).then(conn => {
      console.log('Rabbit connected');
      connection = conn;
      resolve();
    });
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