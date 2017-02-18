module.exports = () => {
  const env = process.env;
  return config = {
    telegram_token: env.FOOBOT_TELEGRAM_TOKEN,
    db: env.FOOBOT_DB || 'mongdb://db',
    rabbit_url: 'amqp://localhost',
    rabbit_exchange: 'foobot',
    rabbit_telegram_queue: 'telegram',
    rabbit_internal_queue: 'internal',
    foobot_url: null,
    telegram_url: 'https://api.telegram.org/bot'
  }
};