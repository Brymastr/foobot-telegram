module.exports = () => {
  const env = process.env;
  const config = {
    telegram_token: env.FOOBOT_TELEGRAM_TOKEN,
    db: env.FOOBOT_DB || 'mongdb://db',
    rabbit_url: 'amqp://localhost',
    foobot_url: null,
    telegram_url: 'https://api.telegram.org/bot'
  }
};