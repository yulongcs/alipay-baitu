const app = getApp();
Page({
  data: {
    username: '',
    mine: [
      { name: "个人信息", url: "../person/person", src: "../../image/list_icon_info.png" },
      { name: "我的钱包", url: "../wallet/wallet", src: "../../image/list_icon_money.png" },
      { name: "意见反馈", url: "../comment_list/comment_list", src: "../../image/list_icon_feedback.png" },
      { name: "刷卡绑定", url: "../swingCard/swingCard", src: "../../image/list_icon_care.png" }
    ]
  },
  onLoad(options) {
    let that = this;
    my.getStorage({
      key: 'userName', // 缓存数据的key
      success: (res) => {
        that.setData({
          userName: res.data
        })
      },
    });
    my.getStorage({
      key: 'id', // 缓存数据的key
      success: (res) => {
        that.setData({
          id: res.data
        })
      },
    });
  },

  // 注销登录
  cancel() {
    let that = this;
    let userName = that.data.userName;
    let time = new Date().getTime();
    let id = that.data.id;
    let url = '/miniprogram/stu/logout';
    let sign = app.common.createSign({
      userName: userName,
      timestamp: time,
    })
    let params = {
      timestamp: time,
      userName: userName,
      sign: sign,
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      console.log(res);
      my.showToast({
        type: "success",
        content: '退出成功',
        duration: 500,
        success: (res) => {
          my.redirectTo({
            url: '../login/login',
          });
        },
      });
    })
  }
});
