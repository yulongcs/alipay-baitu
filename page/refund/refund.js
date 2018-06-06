
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    ifOrder: false,

    backNum: 0,
    backMoney: 0,
    transNum: 0,
    transMoney: 0,

    refundData: '',
    account: '',
    name: '',
    showTrans: false,

    orderData: '',
    notBackMoney: '',
    orderDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userName = my.getStorageSync({
      key: 'userName', // 缓存数据的key
    });
    this.setData({ userName: userName })
    this.getInfo();
  },
  /**
   * 获取退款信息
   */
  getInfo: function () {
    var that = this;
    var time = new Date().getTime();
    var sign = app.common.createSign({
      timestamp: time,
      userName: that.data.userName.data,
    });
    var params = {
      userName: that.data.userName.data,
      timestamp: time,
      sign: sign
    };
    app.req.requestPostApi('/miniprogram/query_V1', params, this, function (res) {
      if (res.res.isHaveBackOrder) {
        that.setData({
          ifOrder: true,
          orderData: res.res.refundOrder,
          orderDetail: [...res.res.backDetails, ...res.res.transDetails],
          notBackMoney: res.res.NotBackCardMoney
        })
      } else {
        that.setData({
          refundData: res.res
        })
        if (res.res.transDetails.length > 0) {
          that.setData({
            showTrans: true
          })
        }
      }

    })
  },
  /**
   * 获取账号及密码
   */
  getAccount: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 获取转账要求
   */
  getWarn: function () {
    my.showModal({
      title: '转账提示',
      content: `下列情况我们将以人工转账的方式退款至您的支付宝账号：
1.充值账单已超过充值平台可退款申请时间；
2.绑定水卡后经由水卡充值所产生的账单，其中账单是否可退由校方决定；`,
    })
  },
  /**
   * 申请退款
   */
  commit: function () {
    var that = this;
    var time = new Date().getTime();
    var sign = app.common.createSign({
      timestamp: time,
      userName: that.data.userName.data,
      alipayAccount: that.data.account,
      realName: that.data.name
    });
    var params = {
      timestamp: time,
      userName: that.data.userName.data,
      alipayAccount: that.data.account,
      realName: that.data.name,
      sign: sign
    }
    my.alert({
      title: '温馨提示',
      content: `1.退款申请将于七个工作日审核；
2.审核通过后将于五个工作日内按原充值账户退回；
3.退款流程完成前无法再次充值；`,
      success: function (res) {
        app.req.requestPostApi('/miniprogram/commit_V1', params, this, function (res) {
          that.getInfo();
        })
      }
    })
  },
  /**
   * 取消退款
   */
  cancel: function () {
    var that = this;
    var time = new Date().getTime();
    var sign = app.common.createSign({
      userName: that.data.userName.data,
      timestamp: time,
    })
    var params = {
      userName: that.data.userName.data,
      timestamp: time,
      sign: sign
    }
    my.alert({
      title: '提示',
      content: '确定取消？',
      success: function (res) {
        app.req.requestPostApi('/miniprogram/cancel_V1', params, this, function (res) {
          my.showToast({
            content: '已取消',
            type: 'success',
            duration: 1500,
            success: function (res) {
              my.navigateBack({})
            }
          })
        })
      }
    })
  },
})