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

function connect(func, attempts, interval) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await func());
    } catch(err) {
      console.error(err)
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

async function amqpConnect() {
  console.log('attempting amqp connection');    
  const connection = await amqp.connect(config.AMQP_CONNECTION);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.EXCHANGE_NAME, 'topic');
  channel.close();
  console.log('amqp connection successful');
  return connection;
}

async function main() {

  app.use(require('./routes'));
  app.use(bodyParser());

  const amqpConnection = await connect(amqpConnect, config.AMQP_CONNECTION_ATTEMPTS, config.AMQP_CONNECTION_RETRY_INTERVAL);
  process.env.ROUTE_TOKEN = telegram.generateToken();
  try {
    if(process.env.URL === undefined || process.env.URL === null) process.env.URL = await ngrok(config.PORT);
  } catch(err) {
    console.log(err)
  }
  app.listen(config.PORT);

  // Subscribe to messages to be sent to Telegram
  queues.consume({
    routeKey: config.OUTGOING_ROUTE_KEY,
    exchangeName: config.EXCHANGE_NAME,
    queueName: config.OUTGOING_QUEUE_NAME,
    connection: amqpConnection
  }, telegram.send);

  await telegram.setWebhook({
    url: process.env.URL,
    route_token: process.env.ROUTE_TOKEN
  });

  console.log('telegram service ready');
}

main();