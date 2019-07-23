const Koa = require('koa')
const handleError = require("koa-handle-error")
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const app = new Koa();
const { router } = require('./router/allRouter.js')
const WeChat = require('./wechat/WeChat')
// 排除不需要token的路径地址
const { encludeUrl } = require('./exclude.json')

// 配置项参数
const config = require('./mainConfig.json')
// 本地测试，这里是我自己的id和secret，防止代码提交时候，把自己信息上传
const p_config = require('./privateConfig.json')
Object.assign(config,p_config)

const wechat = new WeChat(config);

const onError = err => {
    console.error(err)
}

app.use(logger())
    .use(handleError(onError))
    .use(bodyParser())
    .use(cors())
    .use(async (ctx, next) => {
        // 将wechat实例绑定在ctx中，传入路由中（不知道有没有这种做法，开脑洞想的）
        ctx.wechat = wechat;
        // 如果是GET方式，并且是/路径，就是验证服务器，不需要获取access_token了
        if (!encludeUrl[ctx.method].includes(ctx.path)) {
            await ctx.wechat.getAccessToken().then(data => data)
        }
        await next()
    })
    .use(router)


    .listen(3000, '0.0.0.0', () => {
        console.log('成功启动服务')
    })