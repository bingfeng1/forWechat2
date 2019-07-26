const sha1 = require('sha1')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const xmljson = require('fast-xml-parser')  //使用新的xml与json互换
const receiveMsg = require('./receiveMsg')

let { access_token, expires_in } = require('./access_token.json')
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
                        fs.writeFile(path.resolve(__dirname, 'access_token.json'), jsonstr, err => {
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
                } else {
                    console.log("数据成功写入")
                }
            })
        })

    }

    // 创建菜单
    createMenu() {
        let url = `${this.https}${this.appDomain}${this.url.createMenu}`
        let params = {
            access_token
        }
        let { menu } = require('./menuConfig.json')
        let data = JSON.stringify(menu)
        axios.post(url, data, { params })
            .then(result => {
                let data = result.data
                if (data.errcode == 0 && data.errmsg == "ok") {
                    console.log("创建菜单成功")
                } else {
                    throw new Error(data)
                }
            })
    }

    // 获取消息信息
    handleMsg(ctx) {
        return new Promise((resolve, reject) => {
            let buffer = [];
            //监听 data 事件 用于接收数据
            ctx.req.on('data', function (data) {
                buffer.push(data);
            });
            //监听 end 事件 用于处理接收完成的数据
            ctx.req.on('end', function () {
                let msgXml = Buffer.concat(buffer).toString('utf-8');
                //解析xml
                let msgJson = xmljson.parse(msgXml)
                if (msgJson) {
                    let result = msgJson.xml;
                    //判断使用哪个方式去处理，默认nothing因为处理界面中没有nothing的
                    let key = "nothing";
                    // 根据文档，菜单事件都包含一个EventKey（注意，部分内容使用res.send没有用处）
                    if (result.EventKey) {
                        //判断按钮的EventKey。都是自己在config里面定义的，一样就行
                        key = "EventKey"

                    } else if (result.MsgId) {
                        //所有接收用户消息，都会有一个MsgId先使用这个判断
                        // let MsgId = result.MsgId;
                        key = "MsgType"
                    } else {
                        // 如果没有定义的按钮key也没有msgid，那么就是关注/取消关注事件、上报地理位置事件
                        key = "Event"
                    }
                    console.log(msgXml)
                    resolve(receiveMsg[key].has(result[key]) ? receiveMsg[key].get(result[key])(result) : console.log(result, "未知事件，请查看控制台"))
                }
            });

        })
    }
}

module.exports = WeChat
