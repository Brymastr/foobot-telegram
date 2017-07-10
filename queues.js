const
  amqp = require('amqplib'),
  config = require('./config')();

exports.consume = async function(params, func) {
  const channel = await params.connection.createChannel();
  const queue = await channel.assertQueue(params.queueName);
  channel.bindQueue(params.queueName, config.EXCHANGE_NAME, params.routeKey);


  channel.consume(params.queueName, async message => {
    const m = JSON.parse(message.content.toString());
    console.log(`read: ${m}`);

    try {
      // TODO: Remove. This is to simulate some work being done
      await func(m);

      setTimeout(() => {
        console.log('ack');
      }, 2000);

      message.ack();

    } catch(err) {
      console.error(err);
      message.nack();
    }

  });
}