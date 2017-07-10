module.exports = () => {
  const env = process.env;
  return config = {
    PORT: 3101,
    
    AMQP_CONNECTION: 'amqp://localhost',
    EXCHANGE_NAME: 'messages',
    AMQP_CONNECTION_RETRY_INTERVAL: 3000,
    AMQP_CONNECTION_ATTEMPTS: 3,
    EXCHANGE_NAME: 'messages',
    INCOMING_QUEUE_NAME: 'incoming_messages',
    OUTGOING_QUEUE_NAME: 'outgoing_messages',
    OUTGOING_ROUTE_KEY: 'message.telegram.outgoing',

    TELEGRAM_URL: 'https://api.telegram.org/bot',
    TELEGRAM_TOKEN: 'not gonna tell you'
  }
};

