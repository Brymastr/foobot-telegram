const
  Router = require('koa-router'),
  router = new Router(),
  config = require('./config')(),
  uuid = require('uuid'),
  telegram = require('./telegram'),
  normalize = require('./normalize'),
  queues = require('./queues');


router.post('/webhook/telegram/:token', async ctx => {
  if(ctx.params.token !== process.env.ROUTE_TOKEN) {
    ctx.status = 403;
  } else {
    const message = normalize(ctx.request.body);
    if(message !== null)
      queues.publish(message, config.INCOMING_ROUTE_PUBLISH_KEY, config.EXCHANGE_NAME);
    
    ctx.status = 200;
  }
});

router.get('/token', async ctx => {
  ctx.body = process.env.ROUTE_TOKEN;
});

router.post('/token', async ctx => {
  const token = telegram.generateToken();
  process.env.ROUTE_TOKEN = token;
  ctx.body = token;
});

router.get('/url', async ctx => {
  ctx.body = process.env.FOOBOT_TELEGRAM_URL;
});

router.post('/resetUrl', async ctx => {
  const url = telegram.resetUrl();
  const route_token = telegram.generateToken();
  process.env.ROUTE_TOKEN = route_token;
  await telegram.setWebhook({ url, route_token });
  ctx.body = `${url}/webhook/telegram/${route_token}`
});

router.post('/sendMessage', async ctx => {
  const { id, message } = ctx.request.body;

  await telegram.sendMessage({
    chat_id: id,
    text: message
  });
});

module.exports = router.routes();