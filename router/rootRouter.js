const Router = require('koa2-router');
const router = new Router();

// 服务器验证
router.get('/', ctx => {
    let flag = ctx.wechat.checkSignature(ctx.query);
    ctx.response.body = flag
})
    // 获取post信息
    .post('/',async ctx=>{
        let str = await ctx.wechat.handleMsg(ctx).then(data=>data)
        ctx.response.body = str;
    })
    // 获取access_token
    .get('/getAccessToken',async ctx => {
        ctx.response.body = await ctx.wechat.getAccessToken().then(data=>data)
    })

module.exports = {
    router
}