const app = getApp();
Page({
  data: {
    userId: 0,
    userName: '',
    money: '',
    show: false,
    czGive: [],
    actId: '',
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad(options) {
    var that = this;
    my.getStorage({
      key: 'id',
      success: function(res) {
        that.setData({
          sa_id: res.data
        })
      },
    });
    let userId = my.getStorageSync({ key: 'userId' }).data
    that.setData({ userId: userId })
    that.getGive();
  },
   /**
   * 充值送活动
   */
  getGive() {
    let that = this;
    let url = '/miniprogram/stu/getact';
    let time = new Date().getTime();
    let sign = app.common.createSign({
      timestamp: time,
      userName: that.data.userId
    })
    let params = {
      userName: that.data.userId,
      timestamp: time,
      sign: sign
    }
    // 请求充值送
    app.req.requestPostApi(url, params, this, res => {
      console.warn(JSON.stringify(res))
      let array = res.res.detail;
      for (let i = 0; i < array.length; i++) {
        if (i == 0) {
          array[i].getColor = true;
        } else {
          array[i].getColor = false;
        }
      }
      that.setData({
        give: true,
        money: res.res.detail[0].id,
        czGive: array,
        actId: res.res.activity.id
      })
    })
  },
  /**
   * 充值送改变选择高亮
   */
  changeColorCZ(e) {
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
    var promoters = my.getStorageSync({ key: 'promoters' }).data,
      _promoters,
      cacheTime = my.getStorageSync({ key: 'cacheTime' }).data;
    console.warn(promoters, cacheTime)
    console.warn(Date.parse(new Date()))
    if (promoters && cacheTime > Date.parse(new Date())) {
      console.log('执行if')
      _promoters = promoters;
    } else {
      console.log('执行else')
      my.removeStorageSync({
        key: 'promoters',
      });
      my.removeStorageSync({
        key: 'cacheTime',
      });

    }
    var that = this;
    var url = '/miniprogram/alipay';
    var params = {
      userName: that.data.userId,
      stuId: that.data.sa_id,
      money: that.data.money,
      ground_promotion_no: _promoters,
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, function(res) {
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
                my.removeStorageSync({
                  key: 'promoters',
                });
                my.removeStorageSync({
                  key: 'cacheTime',
                });
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
});
