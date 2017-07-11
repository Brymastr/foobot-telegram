const
  Router = require('koa-router'),
  router = new Router(),
  config = require('./config')(),
  uuid = require('uuid'),
  telegram = require('./telegram');


router.post('/webhook/telegram/:token', async ctx => {
  console.log('message receieved')
  if(ctx.params.token !== process.env.ROUTE_TOKEN)
    ctx.status = 403;
  ctx.status = 200;
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
  ctx.body = process.env.URL;
});

router.post('/resetUrl', async ctx => {
  const url = telegram.resetUrl();
  const route_token = telegram.generateToken();
  process.env.ROUTE_TOKEN = route_token;
  await telegram.setWebhook({ url, route_token });
  ctx.body = `${url}/webhook/telegram/${route_token}`
});

module.exports = router.routes();