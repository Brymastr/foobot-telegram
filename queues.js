const
  amqp = require('amqplib'),
  config = require('./config')();

let connection;

exports.setup = async function() {
  console.log('attempting amqp connection');

  // Connect
  connection = await amqp.connect(config.AMQP_CONNECTION);
  const channel = await connection.createChannel();

  // Assert exchange
  await channel.assertExchange(config.EXCHANGE_NAME, 'topic');

  // Assert outgoing queue
  await channel.assertQueue(config.OUTGOING_QUEUE_NAME);
  channel.bindQueue(config.OUTGOING_QUEUE_NAME, config.EXCHANGE_NAME, config.OUTGOING_ROUTE_KEY);

  // Assert incoming queue
  await channel.assertQueue(config.INCOMING_QUEUE_NAME);
  channel.bindQueue(config.INCOMING_QUEUE_NAME, config.EXCHANGE_NAME, config.INCOMING_ROUTE_KEY);

  // Close channel and return
  // channel.close();
  console.log('amqp connection successful');
  return connection;
}

exports.consume = async function(queueName, exchangeName, routeKey, func) {
  const channel = await connection.createChannel();

  channel.consume(queueName, async message => {
    const m = JSON.parse(message.content.toString());
    console.log(`read: ${m}`);

    try {
      await func(m);
      message.ack();
    } catch(err) {
      console.error(err);
      message.nack();
    }

  });
}

exports.publish = async function(message, routeKey, exchangeName) {
  const channel = await connection.createChannel();
  channel.publish(exchangeName, routeKey, new Buffer(JSON.stringify(message)));
  channel.close();  
};