const app = getApp();
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js')

Page({
  data: {
    userId: '',
    comment: [],
  },

  onShow() {
    let userId = my.getStorage({
      key: 'userId', // 缓存数据的key
      success: (res) => {
        this.setData({ userId: res.data })
        this.getComment();
      },
    });
  },

  getComment() {
    let that = this;
    let time = new Date().getTime();
    var url = '/miniprogram/feedback/list';
    var params = {
      userName: that.data.userId,
      timestamp: new Date().getTime(),
      ps: 15,
      pn: 1,
      // 传递参数的时候 通过sign加密
      sign: app.common.createSign({
        userName: that.data.userId,
        timestamp: new Date().getTime(),
        ps: 15,
        pn: 1,
      })
    }
    app.req.requestPostApi(url, params, this, function (res) {
      //console.log(res);
      that.setData({
        comment: res.res
      })
    })
  },
  // 按钮跳转
  gotoComment() {
    my.navigateTo({
      url: '../comment/comment',
    })
  },
  encrypt(...any) {
    var array = any;
    array.sort();
    var str = array.join('&');
    var str2 = str + key;
    var sign = util.hexMD5(str2).toUpperCase();
    return sign;
  },
});
