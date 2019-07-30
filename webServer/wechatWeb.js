const axios = require('axios');
const urlConfig = require("./urlConfig.json");
const querystring = require('querystring');
const util = require('util')

// 配置项参数
const config = require('../mainConfig.json')
// 本地测试，这里是我自己的id和secret，防止代码提交时候，把自己信息上传
const p_config = require('../privateConfig.json')
Object.assign(config, p_config)

// 这里封装两套做法，一套为ajax异步调用，一套为具体操作，为了上层的异步await

const userAjax = {
    getToken(params) {
        // 由于获取的地址中，存在?，这里进行排除
        const { search } = querystring.parse(params.replace('?', ''));
        const { code } = querystring.parse(search.replace('?', ''));
        let url = util.format(urlConfig.getToken, config.appId, config.appsecret, code)
        return axios.get(url)
    },
    getDetail(token, openid) {
        let url = util.format(urlConfig.getUserInfo, token, openid)
        return axios.get(url)
    }
}

const userDo = {
    getToken(data) {
        let nowTime = new Date().getTime();
        let result = data.data;
        if (result.openid) {
            // 获取每一个部分的值，这里的expires_in需要计算，从系统的token同一种方式
            let { access_token, expires_in, openid, refresh_token, scope } = result;
            expires_in = nowTime + expires_in * 1000 - 5 * 60 * 1000
            return { access_token, expires_in, openid, refresh_token, scope }
        } else {
            let { errcode, errmsg } = result;
            throw new Error(`获取用户token失败，失败信息：${errcode}、${errmsg}`)
        }
    },
    getDetail(data) {
        let result = data.data;
        if (result.openid) {
            // 获取每一个部分的值，这里的expires_in需要计算，从系统的token同一种方式
            let { openid, nickname, sex, province, city, country, headimgurl, privilege, unionid } = result;
            openid = checkoutNull(openid)
            nickname = checkoutNull(nickname)
            sex = checkoutNull(sex)
            province = checkoutNull(province)
            city = checkoutNull(city)
            country = checkoutNull(country)
            headimgurl = checkoutNull(headimgurl)
            privilege = checkoutNull(privilege.toString())
            unionid = checkoutNull(unionid)
            return { openid, nickname, sex, province, city, country, headimgurl, privilege, unionid }
        } else {
            let { errcode, errmsg } = result;
            throw new Error(`获取用户详细信息失败，失败信息：${errcode}、${errmsg}`)
        }
    }
}

function checkoutNull(v){
    return v || " "
}

module.exports = {
    userAjax,
    userDo
}