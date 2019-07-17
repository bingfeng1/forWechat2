const Koa = require('koa')
const handleError = require("koa-handle-error")
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const app = new Koa();
const {router} = require('./router/allRouter.js')

const onError = err => {
    console.err(err)
}

app.use(logger())
    .use(handleError(onError))
    .use(bodyParser())
    .use(cors())
    .use(router)


    .listen(3000,'0.0.0.0',()=>{
        console.log('成功启动服务')
    })