# music_api


#### 介绍
支持网易云音乐和QQ音乐的在线搜索的后端API
vue2.x客户端链接（随搜听）：https://github.com/hcyhehe/nbPlayer


#### 软件架构
基于nodejs+express开发而成


#### 安装教程
1. 安装依赖：npm install 
2. 运行：node app.js


#### 使用说明
1.  后台监听端口在config/setting.js里面设置，不设置默认为8086
2.  路由文件为routes/api_router.js
3.  网易云音乐搜索接口：/net163/search，method为get，参数为keywords
    QQ音乐搜索接口：/qq/search，method为get，参数为key


#### 参与贡献
1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


