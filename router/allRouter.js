const Router = require('koa2-router');
const router = new Router();
const {router:rootRouter} = require('./rootRouter.js')
const {router:menuRouter} = require('./menuRouter.js')

router.use('/',rootRouter)
router.use('/',menuRouter)


module.exports = {
    router
}