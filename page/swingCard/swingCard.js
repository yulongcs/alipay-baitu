const app = getApp();

Page({
  data: {
    userName: '',
    mac: '',
    card: '',
    task_uuid: '',
  },
  onShow() {
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
      key: 'card', // 缓存数据的key
      success: (res) => {
        that.setData({
          card: res.data
        })
      },
    });
  },

  // 刷卡绑定
  bind() {
    let that = this;
    let card = that.data.card;
    let mac = that.data.mac;
    let userName = that.data.userName;
    if (!card) {
      my.scan({
        success: (res) => {
          //扫描二维码
          if (res.code.indexOf('mac=') >= 0) {
            mac = res.result.split("mac=")[1];
            if (mac.indexOf('#') >= 0) {
              mac = mac.split('#')[0];
            }
            //支付宝直接扫码
          } else if (res.code.indexOf('mac%3D') >= 0) {
            mac = res.result.split("mac%3D")[1];
            if (mac.indexOf('#') >= 0) {
              mac = mac.split('#')[0];
            }
          }
          //扫描小程序码
          else if (res.path) {
            if (res.path.indexOf('mac=')) {
              mac = res.path.split("mac=")[1];
              if (mac.indexOf('#') >= 0) {
                mac = mac.split('#')[0];
              }
            }
          }
          //二维码内容直接为mac地址
          else {
            mac = res.code;
          }
          that.setData({ mac: mac, })
          var url = '/miniprogram/sign/bind';
          var time = new Date().getTime();
          var sign = app.common.createSign({
            mac: mac,
            userName: that.data.userName,
            timestamp: time,
          });
          var params = {
            mac: mac,
            sign: sign,
            userName: userName,
            timestamp: time,
          }
          var task_uuid = that.data.task_uuid;
          // 调用网络接口
          app.req.requestPostApi(url, params, this, function (res) {
            var task_uuid = res.message;
            my.redirectTo({
              url: "/page/cardReader/cardReader?mac=" + mac + "&userName=" + userName + "&task_uuid=" + task_uuid
            })
          }, this.Failfun)
        }
      });
    }
  },

  // 解绑
  remove() {
    let that = this;
    let userName = that.data.userName;
    let card = that.data.card;
    let time = new Date().getTime();
    let url = '/miniprogram/sign/unlock';
    let sign = app.common.createSign({
      userName: that.data.userName,
      timestamp: time,
    });
    let params = {
      sign: sign,
      timestamp: time,
      userName: userName,
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      my.alert({
        title: '提示',
        content: '确认解绑吗',
        success: (res) => {
          my.showToast({
            content: '解绑成功',
            type: 'success',
            duration: 1000,
            success: (res) => {
              my.setStorage({
                key: 'card',
                data: '',
              })
              that.setData({
                card: '',
              })
              that.onShow();
            }
          })
        },
      });
    })
  }
});
