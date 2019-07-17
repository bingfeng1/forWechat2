const Router = require('koa2-router');
const router = new Router();
const {router:rootRouter} = require('./rootRouter.js')

router.use('/',rootRouter)


module.exports = {
    router
}