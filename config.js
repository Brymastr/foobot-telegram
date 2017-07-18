module.exports = () => {
  const env = process.env;
  return config = {
    PORT: env.PORT || 3101,
    URL: env.FOOBOT_TELEGRAM_URL,
    
    AMQP_CONNECTION: env.AMQP_CONNECTION || 'amqp://localhost',
    EXCHANGE_NAME: 'messages',
    AMQP_CONNECTION_RETRY_INTERVAL: 3000,
    AMQP_CONNECTION_ATTEMPTS: 10,
    INCOMING_QUEUE_NAME: 'incoming_messages',
    OUTGOING_QUEUE_NAME: 'outgoing_telegram_messages',
    OUTGOING_ROUTE_KEY: 'message.telegram.outgoing',
    INCOMING_ROUTE_KEY: 'message.*.incoming',
    INCOMING_ROUTE_PUBLISH_KEY: 'message.telegram.incoming',

    TELEGRAM_URL: 'https://api.telegram.org/bot',
    TELEGRAM_TOKEN: env.TELEGRAM_TOKEN
  }
};

