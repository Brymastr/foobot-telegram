const 
  config = require('./config')(),
  rabbit = require('amqplib');

// Subscribe messages from RabbitMQ
exports.sub = (connection, queue) => {
  return new Promise((resolve, reject) => {
    connection.createChannel()
      .then(channel => {
        return channel.consume(queue, message => {
          if(!message.consumerTag) channel.ack(message);
          resolve(message);
        });
      })
  });
};

// Listen for url on queue
exports.bindIncomingQueue = () => {
  return new Promise((resolve, reject) => {
    rabbit.connect(config.rabbit_url).then(connection => {
      return connection.createChannel()
        .then(channel => {
          channel.assertQueue(config.rabbit_queue);
          return channel;
        })
        .then(channel => {
          channel.bindQueue(config.rabbit_queue, config.rabbit_exchange, 'incoming.message.telegram');
          return channel;
        })
        .then(channel => {
          // channel.close();
          return connection;
        })
        .then(resolve);
      });
  });
};