const
  config = require('./config')(),
  rabbit = require('amqplib'),
  telegram = require('./telegram'),
  queue = process.argv[2];

rabbit.connect(config.rabbit_url).then(connection => {
  return connection.createChannel().then(channel => {
    channel.consume(queue, message => {
      channel.ack(message);
      telegram.process(connection, message);
    });
  });
});