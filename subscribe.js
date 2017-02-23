const
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  config = require('./config')(),
  queue = process.argv[2];

rabbit.connect().then(connection => {
  return connection.createChannel().then(channel => {
    console.log(`Subscriber started for ${queue} queue`);
    channel.consume(queue, message => {
      if(!message.consumerTag) channel.ack(message);
      message = JSON.parse(message.content.toString());
      console.log(message.message.text);
      telegram.process(connection, message);
    })
  });
});