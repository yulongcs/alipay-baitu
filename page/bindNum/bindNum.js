const app = getApp();
Page({
  data: {
    userId: '',                // 用户标识
    telephone: '',            // 手机号码
    code: '',                 //  短信验证码
    codes: '获取验证码',       //   页面文字
    count: 60,                //   存储倒计时
    buttonDsiable: false,     //   三元禁用按钮
  },
  onLoad() {
    my.getStorage({
      key: 'userId', // 缓存数据的key
      success: (res) => {
        this.setData({ userId: res.data })
      },
    });
  },
  // 获取手机号码
  getTel(e) {
    let that = this;
    let telephone = e.detail.value;
    that.setData({
      telephone: telephone
    })
  },

  // 获取验证码
  getCode(e) {
    let that = this;
    let telephone = that.data.telephone;
    let buttonDisable = that.data.buttonDisable;
    let url = '/miniprogram/sendMessage'
    let params = {
      phoneNum: telephone,
      msgType: 'bindPhone',
      timestamp: new Date().getTime(),
      sign: app.common.createSign({
        msgType: 'bindPhone',   //  传递信息类型        
        phoneNum: telephone,
        timestamp: new Date().getTime(),
      })
    }

    // 网络请求
    app.req.requestPostApi(url, params, this, (res) => {
      my.showToast({
        content: '验证码已发送',
        type: 'success',
        duration: 1000,
      });
      let mobile = that.data.mobile;
      let timer = setInterval(() => {
        let count = that.data.count - 1;
        that.setData({
          codes: count + 's重新发送',
          count: count,
          buttonDisable: true,
        })
        if (count < 1) {
          clearInterval(timer);
          that.setData({
            count: 59,
            codes: '获取验证码',
            buttonDisable: false,
          })
        }
      }, 1000)
    })
  },

  // 表单提交
  baitu_getBack(e) {
    let that = this;
    let userId = that.data.userId;
    let telephone = e.detail.value.telephone;
    let code = e.detail.value.code;
    let url = '/alipay/miniprogram/bind_phone'
    let params = { userName: userId, phoneNum: telephone, smsCode: code }
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      my.setStorage({
        key: 'id',
        data: res.res.sa_id
      })
      my.setStorage({
        key:'telephone',
        data:res.res.sa_phone
      })
      my.showToast({
        content: '绑定成功',
        type: 'success',
        duration: 1000,
        success: (res) => {
          my.navigateBack({
            url: '/page/person/person'
          });
        },
      });
    })
  }
});
