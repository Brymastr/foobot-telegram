const 
  Message = require('./Message'),
  config = require('./config')(),
  rabbit = require('amqplib'),
  telegram = require('./telegram');

rabbit.connect(config.rabbit_url)
  .then(connection => connection.createChannel())
  .then(channel => {
    return channel.assertQueue(config.rabbit_queue)
      .then(q => {
        channel.bindQueue(q.queue, config.rabbit_exchange, 'incoming.message.telegram')
        return q.queue;
      })
      .then(queue => channel.consume(queue, message => {
        write(message);
      }));
  });

function write(message) {
  console.log(message.content.toString());
}