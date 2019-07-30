const Router = require('koa2-router');
const router = new Router();
const {router:rootRouter} = require('./rootRouter.js')
const {router:menuRouter} = require('./menuRouter.js')
const {router:webRouter} = require('./webRouter.js')

router.use('/',rootRouter)
router.use('/',menuRouter)
router.use('/web',webRouter)


module.exports = {
    router
}