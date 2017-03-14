const
  config = require('./config')(),
  rabbit = require('amqplib'),
  telegram = require('./telegram'),
  queue = process.argv[2];

rabbit.connect(config.rabbit_url).then(connection => {
  return connection.createChannel().then(channel => {
    channel.consume(queue, message => {
      if(!message.consumerTag) channel.ack(message);
      console.log(message);
      message = JSON.parse(message.content.toString());
      telegram.process(connection, message);
    });
  });
});