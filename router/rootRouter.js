const Router = require('koa2-router');
const router = new Router();

router.get('/',ctx=>{
    ctx.response.body = 'hello success'
})

module.exports = {
    router
}