const
  Router = require('koa-router'),
  router = new Router(),
  config = require('./config')(),
  uuid = require('uuid');

const ROUTE_TOKEN = uuid.v4();

router.post('/webhook/telegram/:token', async ctx => {
  if(ctx.params.token !== ROUTE_TOKEN)
    ctx.status = 403;
  ctx.body = 'get messages';
});

router.get('/token', async ctx => {
  ctx.body = ROUTE_TOKEN;
});

module.exports = router.routes();