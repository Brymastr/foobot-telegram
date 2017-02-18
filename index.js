const 
  Message = require('./Message'),
  config = require('./config')(),
  // rabbit = require('amqplib'),
  rabbit = require('./rabbit'),
  telegram = require('./telegram');

rabbit.init().then(() => {
  rabbit.createChannel().then(channel => {
    channel.consume(config.rabbit_telegram_queue, message => {
      if(!message.consumerTag) channel.ack(message);
      process(JSON.parse(message.content.toString()));
    });
  });
});

// Subscribe to telegram queue


function process(update) {
  telegram.normalize(update).then(message => {
    console.log(message.text);
    return rabbit.pub(`internal.message.nlp`, message);
  });
}