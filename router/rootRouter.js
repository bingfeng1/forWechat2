const Router = require('koa2-router');
const router = new Router();

// 服务器验证
router.get('/', ctx => {
    let flag = ctx.wechat.checkSignature(ctx.query);
    ctx.response.body = flag
})
    // 获取access_token
    .get('/getAccessToken',async ctx => {
        ctx.response.body = await ctx.wechat.getAccessToken().then(data=>data)
    })

module.exports = {
    router
}