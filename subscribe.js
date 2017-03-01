const
  config = require('./config')(),
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  queue = process.argv[2];

console.dir(config)

rabbit.connect().then(connection => {
  return connection.createChannel().then(channel => {
    console.log(`Subscriber started for ${queue} queue`);
    channel.consume(queue, message => {
      if(!message.consumerTag) channel.ack(message);
      message = JSON.parse(message.content.toString());
      // console.log('Subscribe message.', queue);
      telegram.process(connection, message);
    });
  });
});