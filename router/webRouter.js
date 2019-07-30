// 获取用户信息
const Router = require('koa2-router');
const router = new Router();
const { userAjax, userDo } = require('../webServer/wechatWeb')

// 入库操作
const { createUser, createToken } = require('../mysql/sqlData')

// 获取用户token
router.get('/getUserToken', async ctx => {
    let params = ctx.request.search;
    let { access_token, expires_in, openid, refresh_token, scope } = await userAjax.getToken(params)
        .then(data =>
            userDo.getToken(data)
        );
    // 下一步获取用户具体信息
    let { nickname, sex, province, city, country, headimgurl, privilege, unionid } = await userAjax.getDetail(access_token, openid)
        .then(data =>
            userDo.getDetail(data)
        );

    // 入库操作这里不需要等待
    createToken.select(['web_users_token',openid], function (error, results, fields) {
        if (error) throw error;
        if(!results[0]){
            // 这部分还需要修正（可能），官方文档这一块没看懂什么意思，access_token作用都不明白
            createToken.insert(['web_users_token', { access_token, expires_in, openid, refresh_token }])
            createUser.insert(['web_users', { openid, nickname, sex, province, city, country, headimgurl, privilege, unionid }])        
        }
    })
    
    ctx.body = { nickname, sex, province, city, country, headimgurl, privilege, unionid }
})

module.exports = {
    router
}