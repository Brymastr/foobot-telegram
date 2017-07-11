const
  Router = require('koa-router'),
  router = new Router(),
  config = require('./config')(),
  uuid = require('uuid'),
  { promisify } = require('util');
  ngrok = promisify(require('ngrok').connect);

const ROUTE_TOKEN = uuid.v4();
if(config.URL === undefined) {
  ngrok().then(url => config.URL = url);
}

router.post('/webhook/telegram/:token', async ctx => {
  if(ctx.params.token !== ROUTE_TOKEN)
    ctx.status = 403;
  ctx.body = 'get messages';
});

router.get('/token', async ctx => {
  ctx.body = ROUTE_TOKEN;
});

router.get('/url', async ctx => {
  ctx.body = config.URL;
});

module.exports = router.routes();