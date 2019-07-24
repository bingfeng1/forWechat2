/**
 * 获取Post事件，拆分wechat的功能
 * EventKey，是和menuConfig.json定义的内容一一匹配
 * 先把不会有回馈推送的给注释了
 */
const msg = require('./dealMsg')

//按钮事件的接收，并处理
const EventKey = new Map()
    .set("V1001_TODAY_MUSIC",
        function (result) {
            return msg.sendText(result, `这是一个按钮`);
        })
    .set("http://www.soso.com/",
        function (result) {
            return msg.sendText(result, `网络连接地址`);
        })
    .set("rselfmenu_0_1",
        function (result) {
            console.log(`这是扫码推送事件`)
            return msg.sendText(result, `这是扫码推送事件`);
        })
    .set("rselfmenu_0_0",
        function (result) {
            console.log(`这是扫码带提示`)
            return msg.sendText(result, `这是扫码带提示`);
        })
    .set("rselfmenu_1_0",
        function (result) {
            console.log(`系统拍照发图`)
            return msg.sendText(result, `系统拍照发图`);
        })
    .set("rselfmenu_1_1",
        function (result) {
            console.log(`拍照或者相册发图`)
            return msg.sendText(result, `拍照或者相册发图`);
        })
    .set("rselfmenu_1_2",
        function (result) {
            console.log('微信相册发图')
            return msg.sendText(result, `微信相册发图`);
        })
    .set("rselfmenu_2_0",
        function (result) {
            console.log(`发送位置`)
            return msg.sendText(result, `发送位置`);
        })

const MsgType = new Map()
    .set('text',
        function (result) {
            let textContent = result.Content;
            textContent = autoWord.has(textContent) ? autoWord.get(textContent) : textContent;
            return msg.sendText(result, textContent);
        })
    .set("image"
        , function (result) {
            console.log('单张图片信息')
            return msg.sendText(result, `回馈图片`);
        })
    .set("voice"
        , function (result) {
            return msg.sendText(result, `回馈声音`);
        })
    .set("video"
        , function (result) {
            return msg.sendText(result, `回馈视频`);
        })
    .set("shortvideo"
        , function (result) {
            return msg.sendText(result, `回馈小视频`);
        })
    .set("location"
        , function (result) {
            return msg.sendText(result, `回馈地理`);
        })
    .set("link"
        , function (result) {
            return msg.sendText(result, `回馈连接`);
        })

const Event = new Map()
    .set("subscribe",
        function (result) {
            return msg.sendText(result, `欢迎关注晓鸣测试公众号，回复1查看git地址`);
            // console.log('有人关注公众号了')
        })
    .set("unsubscribe",
        function (result) {
            // res.send(msg.sendText(result, `成功取消关注公众号`));
            console.log('有人取关公众号了')
        })
    .set("LOCATION",
        function (result) {
            let Latitude = result.Latitude;
            let Longitude = result.Longitude;
            let Precision = result.Precision;
            console.log('??????',Latitude, Longitude, Precision);
        })

module.exports = {
    EventKey,
    MsgType,
    Event
}

// 文字自动回复
const autoWord = new Map()
    .set('1','项目的git 地址为：git@github.com:bingfeng1/forWeChat2.git')
    .set('2','自动回复还是蛮成功的')