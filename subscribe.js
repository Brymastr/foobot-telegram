const
  config = require('./config')(),
  rabbit = require('amqplib'),
  telegram = require('./telegram'),
  queue = process.argv[2];

rabbit.connect(config.rabbit_url).then(connection => {
  return connection.createChannel().then(channel => {
    console.log(`Subscriber started for ${queue} queue`);
    channel.consume(queue, message => {
      if(!message.consumerTag) channel.ack(message);
      message = JSON.parse(message.content.toString());
      console.log('Subscribe message.', queue);
      telegram.process(connection, message);
    });
  });
});