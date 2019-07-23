const Router = require('koa2-router');
const router = new Router();
const axios = require('axios')

// 服务器验证
router.get('/getMenu',ctx => {
    let wechat = ctx.wechat;
    wechat.getMenu();
    ctx.response.body = "请查看控制台结果"    
})
    .get('/createMenu',async ctx => {
        let wechat = ctx.wechat;
        
        wechat.createMenu();
        ctx.response.body = "请查看控制台结果"
    })

module.exports = {
    router
}