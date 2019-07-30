-- 创建数据库
CREATE DATABASE wechat;
-- 用户表，存储用户信息
CREATE TABLE `web_users` (
  `openid` VARCHAR(100) NOT NULL COMMENT '微信平台用户id',
  `nickname` VARCHAR(100) DEFAULT NULL COMMENT '用户昵称',
  `sex` INT(11) DEFAULT NULL COMMENT '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知',
  `province` VARCHAR(100) DEFAULT NULL COMMENT '用户个人资料填写的省份',
  `city` VARCHAR(100) DEFAULT NULL COMMENT '普通用户个人资料填写的城市',
  `country` VARCHAR(100) DEFAULT NULL COMMENT '国家，如中国为CN',
  `headimgurl` VARCHAR(1000) DEFAULT NULL COMMENT '用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。',
  `privilege` VARCHAR(500) DEFAULT NULL COMMENT '用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）',
  `unionid` VARCHAR(500) DEFAULT NULL COMMENT '只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。',
  PRIMARY KEY (`openid`)
);

-- 用户信息相关的token
CREATE TABLE `web_users_token` (
  `openid` VARCHAR(100) NOT NULL COMMENT '微信平台用户id',
  `access_token` VARCHAR(200) DEFAULT NULL COMMENT '微信用户token',
  `expires_in` VARCHAR(50) DEFAULT NULL COMMENT '微信用户token过期时间',
  `refresh_token` VARCHAR(200) DEFAULT NULL COMMENT '用于刷新token',
  `refresh_token_endtime` VARCHAR(50) DEFAULT NULL COMMENT '刷新token的有效期',
  PRIMARY KEY (`openid`)
)