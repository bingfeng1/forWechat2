const sha1 = require('sha1')
// 配置项参数
const config = require('./mainConfig.json')
// 微信的总功能模块

class WeChat{
    constructor(){

    }

    // 验证服务器
    static checkSignature(data){
        // 获取接入数据传进来的参数
        let {signature,timestamp,nonce,echostr} = data;
        // 1）将token、timestamp、nonce三个参数进行字典序排序 
        let tempstr = [config.token,timestamp,nonce].sort().join().replace(/,/g,"");
        // 2）将三个参数字符串拼接成一个字符串进行sha1加密 
        let tempsha1 = sha1(tempstr);
        // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        return tempsha1 == signature ? echostr : false;
    }

}

module.exports = WeChat
