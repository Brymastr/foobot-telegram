module.exports = () => {
  const env = process.env;
  return config = {
    telegram_token: env.FOOBOT_TELEGRAM_TOKEN,
    db: env.FOOBOT_DB_CONN || 'mongdb://localhost',
    rabbit_url: env.FOOBOT_RABBIT_QUEUE || 'amqp://localhost',
    rabbit_exchange: 'foobot',
    rabbit_telegram_queue: 'telegram',
    rabbit_internal_queue: 'internal',
    telegram_url: 'https://api.telegram.org/bot',
    foobot_core_url: env.FOOBOT_CORE_URL || 'http://localhost:9000'
  }
};