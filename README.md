# 通过koa与axios搭建微信服务器
通过搭建本次项目，学习koa与axios

├── dist：静态编译后的文件
├── mysql：连接数据库的增删改查目录
|   ├── sqlData：目前是所有sql操作的集合
├── router为路由目录，所有的路由存放在这里
|   ├── allRouter：总目录，连接不同模块的目录
|   ├── rootRouter：根目录
|   |   ├──"GET /"：用于验证微信服务器与本地服务器的连接
|   |   ├── "GET /getAccessToken"：用于获取access_token使用
|   |   ├──"POST /"：获取用户发送的信息，并返回信息
|   ├── menuRouter：目录相关
|   |   ├──"GET /getMenu"：获取按钮增加至文件保存
|   |   ├──"GET /createMenu"：创建自定义按钮
|   ├── webRouter：为网页提供ajax服务
|   |   ├──"GET /getUserToken"：获取用户token（与系统的token无关）
├── webServer：网页ajax的服务层
|   ├── urlConfig.json：所有相关路由路径
|   ├── weChatWeb：具体服务操作（因为koa我没找到可以传递ctx并可以返回给页面的方法，目前将这些方法分两步调用）
|   |   ├──userAjax：需要使用ajax调用的异步地址
|   |   ├──userDo：当异步调用结束后，进行的操作
├── wechat：微信功能模块
|   ├── access_token.json：存放后台access_token的使用
|   ├── dealMsg：处理xml与json转换，为了数据接受与发送
|   ├── menuConfig.json：微信公众号的自定义按钮
|   ├── receiveMsg：处理公众号发送来的信息
|   ├── WeChat：微信文档中的各功能块的具体实现
|   |   ├──checkSignature：用于服务器验证方法
|   |   ├──getAccessToken：获取token的方法，也可以通过中间件的方式获取
|   |   ├──getMenu：获取按钮菜单
|   |   ├──createMenu：创建按钮菜单
|   |   ├──handleMsg：处理接受的信息，在receiveMsg中具体处理（这一层需要与业务挂钩，目前全是返回文字，在dealMsg中，包括几乎所有可被动推送的信息方法）
├── mainConfig：路由配置与固定参数
├── exclude.json：阻止获取access_token的调用
├── index.js：入口文件
├── wechat.sql：建数据库相关信息

# 首先获取微信服务器的认证
在微信公众平台中，配置服务器验证，输入本地服务的ip地址。通过get请求验证，经过WeChat的checkSignature检测配置

# 获取access_token
```
https请求方式: GET
https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```

# 微信第三方网页
- 通过按钮的url配置，成功获取了用户信息
- 使用了一个页面绑在这个服务中（koa-static），访问后返回的url带有需要的地址，这个应该需要在页面的js中获取路由的方式拿到参数

# 现存疑问
- 如何拿到sql执行成功后的，执行语句。如果做日志管理的话，这里弄不出来
- koa中的ctx作为参数传递，并不能成功将结果返回
- koa的中间件会写，但不知道什么情况下用，目前只用到获取系统access_token
- 与数据库交互，代码是否需要拆分，我的做法是否太过臃肿
- 如何进行合理的错误处理