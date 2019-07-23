const sha1 = require('sha1')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
let { access_token, expires_in } = require('../wechat/access_token.json')
// 微信的总功能模块

class WeChat {
    constructor(config) {
        this.config = config;
        this.appId = config.appId;
        this.appsecret = config.appsecret;
        this.token = config.token;
        this.appDomain = config.appDomain;
        this.appDomain2 = config.appDomain2;
        this.http = config.http;
        this.https = config.https;
        this.url = config.url;
        this.access_token = "";
    }

    // 验证服务器
    checkSignature(data) {
        // 获取接入数据传进来的参数
        let { signature, timestamp, nonce, echostr } = data;
        // 1）将token、timestamp、nonce三个参数进行字典序排序 
        let tempstr = [this.token, timestamp, nonce].sort().join().replace(/,/g, "");
        // 2）将三个参数字符串拼接成一个字符串进行sha1加密 
        let tempsha1 = sha1(tempstr);
        // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        return tempsha1 == signature ? echostr : false;
    }

    //获取token
    getAccessToken() {
        return new Promise(resolve => {
            let params = {
                grant_type: "client_credential",
                appid: this.appId,
                secret: this.appsecret
            }
            // 获取当前时间戳
            let nowTime = new Date().getTime();
            // 获取文件中过期时长（减去5分钟）
            // 对比文件中的时间与现在的差距
            if (nowTime > expires_in) {
                axios.get(`${this.https}${this.appDomain}${this.url.getAccessToken}`, {
                    params
                }).then(data => {
                    if (data.status == 200) {
                        let result = data.data
                        access_token = result.access_token;
                        expires_in = nowTime + result.expires_in * 1000 - 5 * 60 * 1000
                        let jsonstr = JSON.stringify({
                            access_token,
                            expires_in
                        });
                        fs.writeFile(path.resolve(__dirname, '..', 'wechat', 'access_token.json'), jsonstr, err => {
                            if (err) {
                                throw new Error('写入access_token文件失败')
                            }
                        })
                    }
                    this.access_token = access_token
                    resolve(access_token)
                })
            } else {
                this.access_token = access_token
                resolve(access_token)
            }
        })
    }

    // 获取按钮菜单列表
    getMenu() {
        let url = `${this.https}${this.appDomain}${this.url.getMenu}`
        let params = {
            access_token
        }
        axios.get(url, {
            params
        }).then(result => {
            let data = result.data
            let json = JSON.stringify(data)
            fs.writeFile(path.resolve(__dirname, 'menuConfig.json'), json, err => {
                if (err) {
                    throw new Error("按钮菜单写入文件失败")
                }else{
                    console.log("数据成功写入")
                }
            })
        })

    }

    // 创建菜单
    createMenu(){
        let url = `${this.https}${this.appDomain}${this.url.createMenu}`
        let params = {
            access_token
        }
        let {menu} = require('../wechat/menuConfig.json')
        let data = JSON.stringify(menu)
        axios.post(url,data,{params})
            .then(result=>{
                let data = result.data
                if(data.errcode ==0 && data.errmsg == "ok"){
                    console.log("创建菜单成功")
                }else{
                    throw new Error(data)
                }
            })
    }

}

module.exports = WeChat
