const
  rabbit = require('./rabbit'),
  telegram = require('./telegram'),
  config = require('./config');
  
const queue = process.argv[2];
rabbit.connect()
  .then(connection => connection.createChannel())
  .then(channel => {
    console.log(`Subscriber started for ${queue} queue`)
    channel.consume(queue, message => {
      if(!message.consumerTag) channel.ack(message);
      console.log(message);
      telegram.process(message);
    })
  });