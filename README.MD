## 佰途（支付宝版）

- 支付宝小程序

## 技术栈

- 原生js
- ES6写法


## 注意事项

- Tips:需要安装七牛云sdk
- 查看项目完整效果，在小程序内搜索
- clone代码,出现看不了的情况,缺少appId和权限(请按照上句话操作)

## 项目结构

<pre>
├── assets                      // 静态资源
├── image                       // 图片文件
├── service                     // 公共封装js
├── uitls                       // 基础封装JS
├── app.js                      // 全局配置
├── app.json                    // 全局路径配置
├── app.acss                    // 全局样式配置
├── page                        // 生产目录
│   ├── cardReader              // 读卡页
│   ├── comment                 // 反馈页
│   ├── comment_list            // 反馈列表页
│   ├── index                   // 主页面
│   ├── mine                    // 个人中心页
│   ├── person                  // 个人信息页
│   ├── recharge                // 充值页
│   ├── record                  // 消费信息页
│   ├── refund                  // 退款页(暂支持一个学校)
│   ├── school                  // 选择学校页
│   ├── swingCard               // 刷卡绑定页
│   ├── wallet                  // 钱包页
└──
</pre>


## 部分截图

![首页](./image/1.gif)