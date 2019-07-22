const Router = require('koa2-router');
const router = new Router();
const WeChat = require('../wechat/WeChat')

router.get('/',ctx=>{
    let flag = WeChat.checkSignature(ctx.query);
    ctx.response.body = flag
})

module.exports = {
    router
}