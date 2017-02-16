const 
  config = require('./config'),
  rabbit = require('amqplib');

const connection = rabbit.connect(config.rabbit_url);

// Publish to RabbitMQ with a given topic
exports.pub = (topic, message) => {
  return new Promise((resolve, reject) => {
    connection
      .then(conn => conn.createChannel())
      .then(channel => {
        return channel.checkExchange('foobot', 'topic', {durable: true}).then(ok => {
          return channel.publish(topic, new Buffer(message.text));
        });
      })
      .then(() => resolve(message))
      .catch(reject);
  })
}

// Subscribe messages with a given topic from RabbitMQ
exports.sub = topic => {
  return new Promise((resolve, reject) => {
    connection
      .then(conn => conn.createChannel())
      .then(channel => {
        return channel.checkExchange(topic).then(ok => {
          return channel.consume(topic, msg => {
            console.log(`Message dequeued: ${msg.content.toString()}`);
            channel.ack(msg);
          });
        })
      })
      .then(resolve)
      .catch(reject);
  });   
};