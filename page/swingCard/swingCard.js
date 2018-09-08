const app = getApp();

Page({
  data: {
    userId: '',
    mac: '',
    cardNo: '',
    task_uuid: '',
  },
  onShow() {
    let that = this;
    my.getStorage({
      key: 'userId', // 缓存数据的key
      success: (res) => {
        that.setData({
          userId: res.data
        })
      },
    });
    my.getStorage({
      key: 'cardNo', // 缓存数据的key
      success: (res) => {
        that.setData({
          cardNo: res.data
        })
      },
    });
  },

  // 刷卡绑定
  bind() {
    let that = this;
    let cardNo = that.data.cardNo;
    let mac = that.data.mac;
    let userId = that.data.userId;
    if (!cardNo) {
      my.scan({
        success: (res) => {
          console.log(res)
          mac = res.code;
          that.setData({ mac: mac, })
          var url = '/miniprogram/sign/bind';
          var time = new Date().getTime();
          var sign = app.common.createSign({
            mac: mac,
            userName: userId,
            timestamp: time,
          });
          var params = {
            mac: mac,
            sign: sign,
            userName: userId,
            timestamp: time,
          }
          var task_uuid = that.data.task_uuid;
          // 调用网络接口
          app.req.requestPostApi(url, params, this, function(res) {
            var task_uuid = res.message;
            my.redirectTo({
              url: "/page/cardReader/cardReader?mac=" + mac + "&userName=" + userId + "&task_uuid=" + task_uuid
            })
          })
        }
      });
    }
  },

  // 解绑
  remove() {
    let that = this;
    let userId = that.data.userId;
    let cardNo = that.data.cardNo;
    let time = new Date().getTime();
    let url = '/miniprogram/sign/unlock';
    let sign = app.common.createSign({
      userName: userId,
      timestamp: time,
    });
    let params = {
      sign: sign,
      timestamp: time,
      userName: userId,
    }
    if (cardNo !== null && cardNo !== '' && cardNo !== "") {
      my.confirm({
        title: '提示',
        content: '确认解绑吗',
        confirmButtonText: '确定',
        success: res => {
          if (res.confirm) {
            app.req.requestPostApi(url, params, this, res => {
              my.showToast({
                content: '解绑成功',
                type: 'success',
                duration: 1000,
              })
              my.setStorage({
                key: 'cardNo', // 缓存数据的key
                data: '',
              });
              that.setData({ cardNo: '' })
            })
          } else {
            my.showToast({
              content: '已取消',
              type: 'fail',
              duration: 1000,
              success: (res) => {
                return false;
              },
            });
          }
        }
      })
    } else {
      my.showToast({
        content: '未绑卡',
        type: 'fail',
        duration: 1000,
        success: res => {
          return false;
        }
      })
    }
  }
});
