const app = getApp();
Page({
  data: {
    money: '',
    showRefund: false,
  },
  getMoney() {
    let that = this;
    let userName = my.getStorageSync({
      key: 'userName', // 缓存数据的key
    });
    let time = new Date().getTime();
    let url = '/miniprogram/stu/money';
    let sign = app.common.createSign({
      userName: userName.data,
      timestamp: time
    })
    let params = {
      userName: userName.data,
      timestamp: time,
      sign: sign
    }
    app.req.requestPostApi(url, params, this, (res) => {
      console.log(res);
      that.setData({
        money: res.message
      })
    });
  },
  /**
   * 获取退款权限
   */
  getRefund: function () {
    var that = this;
    var userName = my.getStorageSync({
      key: 'userName', // 缓存数据的key
    });
    var time = new Date().getTime();
    var sign = app.common.createSign({
      userName: userName.data,
      timestamp: time,
    })
    var params = {
      userName: userName.data,
      timestamp: time,
      sign: sign
    };
    app.req.requestPostApi('/miniprogram/app/initAfterLogin', params, this, function (res) {
      if (res.res.isRefund) {
        that.setData({
          showRefund: true
        })
      }
    })
  },
  /**
   * 跳转至充值页面
   */
  goto: function () {
    my.navigateTo({
      url: '../recharge/recharge'
    })
  },
  /**
  * 跳转到退款页面
  */
  refund: function () {
    my.navigateTo({
      url: '../refund/refund',
    })
  },
  /**
   * 记录页面
   */
  record: function () {
    my.navigateTo({
      url: '../record/record',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRefund();
    this.getMoney();  
  },
});
