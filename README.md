# 通过koa与axios搭建微信服务器
通过搭建本次项目，学习koa与axios

- router为路由目录，所有的路由存放在这里
  - allRouter：总目录，连接不同模块的目录
  - rootRouter：根目录
    - "GET /"：用于验证微信服务器与本地服务器的连接

- wechat微信功能模块
  - mainConfig：路由配置与固定参数
  - WeChat：微信文档中的各功能块的具体实现
    - static checkSignature：用于服务器验证方法

# 首先获取微信服务器的认证
在微信公众平台中，配置服务器验证，输入本地服务的ip地址。通过get请求验证，经过WeChat的checkSignature检测配置

