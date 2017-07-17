const
  Koa = require('koa'),
  app = new Koa(),
  bodyParser = require('koa-bodyparser'),
  config = require('./config')(),
  amqp = require('amqplib'),
  request = require('request-promise-native'),
  telegram = require('./telegram'),
  queues = require('./queues'),
  { promisify } = require('util'),
  ngrok = promisify(require('ngrok').connect);

app.use(bodyParser({enableTypes: ['json']}));
app.use(require('./routes'));
main();

function connect(func, attempts, interval) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await func());
    } catch(err) {
      // console.error(err)
      if(attempts === 1) {
        reject(new Error('Max connection attempts reached'));
        return;
      }
      setTimeout(async () => {
        resolve(await connect(func, --attempts, interval));
      }, interval);
    }
  });
}

async function main() {

  const amqpConnection = await connect(queues.setup, config.AMQP_CONNECTION_ATTEMPTS, config.AMQP_CONNECTION_RETRY_INTERVAL);
  process.env.ROUTE_TOKEN = telegram.generateToken();
  try {
    if(process.env.FOOBOT_TELEGRAM_URL === undefined || process.env.FOOBOT_TELEGRAM_URL === null) process.env.FOOBOT_TELEGRAM_URL = await ngrok(config.PORT);
  } catch(err) {
    console.log(err);
  }
  app.listen(config.PORT);
  

  // Subscribe to messages to be sent to Telegram
  queues.consume(
    config.OUTGOING_QUEUE_NAME,
    config.EXCHANGE_NAME,
    config.OUTGOING_ROUTE_KEY,
    telegram.send
  );

  await telegram.setWebhook({
    url: process.env.FOOBOT_TELEGRAM_URL,
    route_token: process.env.ROUTE_TOKEN
  });

  console.log('telegram service ready');
}