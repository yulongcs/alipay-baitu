const app = getApp();
Page({
  data: {
    userId: 0,
    userName: '',
    money: 100,
    show: false,
    txtArray: [
      {
        id: '100',
        text: '100元',
        getColor: true
      },
      {
        id: '50',
        text: '50元',
        getColor: false
      },
      {
        id: '30',
        text: '30元',
        getColor: false
      },
      {
        id: '20',
        text: '20元',
        getColor: false
      },
      {
        id: '10',
        text: '10元',
        getColor: false
      },
      {
        id: 'other',
        text: '其他金额',
        getColor: false
      }
    ],
    czGive: [],
    give: false,
    actId: '',
  },
  /**
  * 更改高亮状态及data.money
  */
  changeColor: function (e) {
    var textArray = [];
    for (var i = 0; i < this.data.txtArray.length; i++) {
      if (e.target.id == this.data.txtArray[i].id) {
        var color = "txtArray[" + i + "].getColor"
        if (e.target.id == 'other') {
          this.setData({
            [color]: true,
            show: true,
            money: 0
          })
        } else {
          this.setData({
            [color]: true,
            show: false,
            money: parseInt(e.target.id)
          })
        }
      } else {
        var color = "txtArray[" + i + "].getColor"
        this.setData({
          [color]: false,
        })
      }
    }
  },
  /**
   * 充值送改变选择高亮
   */
  changeColorCZ: function (e) {
    var czArray = [];
    for (var i = 0; i < this.data.czGive.length; i++) {
      if (e.target.id == this.data.czGive[i].id) {
        var color = "czGive[" + i + "].getColor"
        if (e.target.id == 'other') {
          this.setData({
            [color]: true,
            show: true,
            money: 0
          })
        } else {
          this.setData({
            [color]: true,
            show: false,
            money: parseInt(e.target.id)
          })
        }
      } else {
        var color = "czGive[" + i + "].getColor"
        this.setData({
          [color]: false,
        })
      }
    }
  },
  /**
   * 获取输入金额
   */
  getMoney: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  /**
   * 充值button事件
   */
  recharge() {
    if (this.data.money == 0) {//充值数目不为空
      my.alert({
        title: '提示',
        content: '请输入或选择充值金额',
      })
      return;
    }
    var that = this;
    var url = '/miniprogram/alipay';
    var params = {
      userName: that.data.userId,
      stuId: that.data.sa_id,
      money:that.data.money,
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, function (res) {
      var tradeNO = res.res
      my.tradePay({
        tradeNO: tradeNO,
        success: (res) => {
          if (res.resultCode == 9000) {
            my.showToast({
              type: 'success',
              content: '充值成功',
              duration: 1200,
              success: (res) => {
                my.switchTab({
                  url: '/page/index/index',
                });
              },
            });
          } else if (res.resultCode == 4000) {
            my.showToast({
              type: 'fail',
              content: '充值失败',
              duration: 1200,
            });
          } else if (res.resultCode == 6001) {
            my.showToast({
              type: 'fail',
              content: '已取消支付',
              duration: 1200,
            });
          }
        },
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    my.getStorage({
      key: 'id',
      success: function (res) {
        that.setData({
          sa_id: res.data
        })
      },
    });
    my.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        })
      },
    })
  },
});
