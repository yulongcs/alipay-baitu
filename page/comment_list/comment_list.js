const app = getApp();
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js')

Page({
  data: {
    userName: '',
    comment: [],
  },
  onLoad: function (options) {
    this.getComment();
  },

  onShow: function () {
    this.getComment();
  },

  getComment() {
    let that = this;
    let userName = my.getStorageSync({
      key: 'userName', // 缓存数据的key
    });
    let time = new Date().getTime();
    that.setData({
      userName: userName.data,
    });
    var url = '/miniprogram/feedback/list';
    var params = {
      userName: userName.data,
      timestamp: new Date().getTime(),
      ps: 15,
      pn: 1,
      // 传递参数的时候 通过sign加密
      sign: app.common.createSign({
        userName: userName.data,
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
  gotoComment: function () {
    my.navigateTo({
      url: '../comment/comment',
    })
  },
  encrypt: function (...any) {
    var array = any;
    array.sort();
    var str = array.join('&');
    var str2 = str + key;
    var sign = util.hexMD5(str2).toUpperCase();
    return sign;
  },
});
