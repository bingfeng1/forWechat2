// 获取用户信息
const Router = require('koa2-router');
const router = new Router();
const querystring = require('querystring');
const { userAjax, userDo } = require('../webServer/wechatWeb')

// 数据库操作
const dealSql = require('../mysql/sqlData')

// 获取用户token
router.get('/getUserToken', async ctx => {
    let params = ctx.request.search;
    // 获取openid和code
    let { search, openid } = querystring.parse(params.replace('?', ''));
    const { code } = querystring.parse(search.replace('?', ''));

    let token = {};
    // 如果有openid，那么现在数据库中，查找相关的token
    // 如果没有那么就通过网络查询
    if (openid) {
        // 从数据库查找相关token
        let params = [["openid", "access_token", "expires_in", "refresh_token", "refresh_token_endtime"], "web_users_token", { openid }]
        token = await dealSql.SELECT(params)
            .then(data => data[0])
            .catch(error => {
                throw new Error(error)
            })
        let nowTime = new Date().getTime();
        // 如果token已经过期
        if (token.expires_in < nowTime) {
            // // 如果可刷新token也过期了
            // if (token.refresh_token_endtime < nowTime) {
            // 那么这里重新从服务器获取
            token = await userAjax.getToken(code)
                .then(data => userDo.getToken(data.data)
                );
            // } else {
            //     // 否则刷新token
            //     token = await userAjax.refreshToken(token.refresh_token)
            //         .then(data => userDo.getToken(data.data))
            // }
            let params = ["web_users_token", token, { openid }]
            // 更新到数据库，这里不需要await
            dealSql.UPDATE(params).then(data =>
                data
            ).catch(error => {
                throw new Error(error)
            })
        }
    } else {
        // 没有openid的话，就通过接口获取
        token = await userAjax.getToken(code)
            .then(data => userDo.getToken(data.data)
            );
        // 从数据库查找相关token
        let params = [["access_token", "expires_in", "refresh_token", "refresh_token_endtime"], "web_users_token", { openid: token.openid }]
        dealSql.SELECT(params)
            .then(data => {
                if (data[0]) {
                    let params = ["web_users_token", token, { openid: token.openid }]
                    // 更新到数据库，这里不需要await
                    dealSql.UPDATE(params).then(data =>
                        data
                    ).catch(error => {
                        throw new Error(error)
                    })
                } else {
                    let params = ["web_users_token", token]
                    dealSql.INSERT(params).then(data =>
                        data
                    ).catch(error => {
                        throw new Error(error)
                    })
                }
            })
            .catch(error => {
                throw new Error(error)
            })
    }

    // 这里的token已经更新完成
    // 开始获取用户信息
    // 先简化操作，直接获取，直接抛出
    let { openid: n_openid, nickname, sex, province, city, country, headimgurl, privilege, unionid } = await userAjax.getDetail(token.access_token, token.openid)
        .then(data =>
            userDo.getDetail(data.data)
        )
    openid = n_openid;
    // 入库或者更新操作
    let select_detail_params = [["nickname", "sex", "province", "city", "country", "headimgurl", "privilege", "unionid"], "web_users", { openid: token.openid }]
    dealSql.SELECT(select_detail_params).then(data => {
        if (data[0]) {
            let params = ["web_users", { nickname, sex, province, city, country, headimgurl, privilege, unionid }, { openid: token.openid }]
            // 更新到数据库，这里不需要await
            dealSql.UPDATE(params).then(data =>
                data
            ).catch(error => {
                throw new Error(error)
            })
        } else {
            let params = ["web_users", { openid: token.openid, nickname, sex, province, city, country, headimgurl, privilege, unionid }]
            dealSql.INSERT(params).then(data =>
                data
            ).catch(error => {
                throw new Error(error)
            })
        }
    })

    ctx.body = { openid, nickname, sex, province, city, country, headimgurl, privilege, unionid };
})

    .post('/getWriteDetail', async ctx => {
        let params = ctx.request.body;
        // 入库或者更新操作
        let { openid, phone, address, email, birthday, other } = params;
        let select_detail_params = [["openid", "phone", "address", "email", "birthday", "other"], "web_users_detail", { openid: params.openid }]
        let result = await dealSql.SELECT(select_detail_params).then(async data => {
            if (data[0]) {
                let params = ["web_users_detail", { phone, address, email, birthday, other }, { openid }]
                // 更新到数据库，这里不需要await
                return await dealSql.UPDATE(params).then(data =>
                    data
                ).catch(error => {
                    throw new Error(error)
                })
            } else {
                let params = ["web_users_detail", { openid, phone, address, email, birthday, other }]
                return await dealSql.INSERT(params).then(data =>
                    data
                ).catch(error => {
                    throw new Error(error)
                })
            }
        })
        ctx.body = result;
    })

    .get("/getDetail", async ctx => {
        let params = querystring.parse(ctx.request.querystring);
        // 入库或者更新操作
        let { openid } = params;
        let select_detail_params = [["openid", "phone", "address", "email", "birthday", "other"], "web_users_detail", { openid }]
        let result = await dealSql.SELECT(select_detail_params).then(async data => {
            return data[0];
        })
        ctx.body = result || "";
    })

module.exports = {
    router
}