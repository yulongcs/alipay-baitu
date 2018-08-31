const app = getApp();
Page({
  data: {
    money: '',
    userId: '',
    showRefund: false,
    showPay: false,
  },
  getMoney() {
    let that = this;
    let userId = that.data.userId;
    let time = new Date().getTime();
    let url = '/miniprogram/stu/money';
    let sign = app.common.createSign({
      userName: userId,
      timestamp: time
    })
    let params = {
      userName: userId,
      timestamp: time,
      sign: sign
    }
    app.req.requestPostApi(url, params, this, (res) => {
      that.setData({
        money: res.message
      })
    });
  },
  /**
   * 获取退款权限
   */
  getRefund: function() {
    let that = this;
    let userId = that.data.userId;
    let time = new Date().getTime();
    let sign = app.common.createSign({
      userName: userId,
      timestamp: time,
    })
    let params = {
      userName: userId,
      timestamp: time,
      sign: sign
    };
    app.req.requestPostApi('/miniprogram/app/initAfterLogin', params, this, function(res) {
      if (res.res.isRefund) {
        that.setData({
          showRefund: true
        })
      }
      if (res.res.isRecharge) {
        that.setData({ showPay: true })
      } else {
        that.setData({ showPay: true })
      }
    })
  },
  /**
   * 跳转至充值页面
   */
  goto: function() {
    my.navigateTo({
      url: '../recharge/recharge'
    })
  },
  /**
  * 跳转到退款页面
  */
  refund: function() {
    my.navigateTo({
      url: '../refund/refund',
    })
  },
  /**
   * 记录页面
   */
  record: function() {
    my.navigateTo({
      url: '../record/record',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this;
    let userId = my.getStorageSync({
      key: 'userId', // 缓存数据的key
    }).data;
    that.setData({ userId: userId })
    that.getRefund();
    that.getMoney();
  },
});
