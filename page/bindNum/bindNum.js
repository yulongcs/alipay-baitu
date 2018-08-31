const app = getApp();
Page({
  data: {
    userId: '',                // 用户标识
    telephone: '',            // 手机号码
    code: '',                 //  短信验证码
    codes: '获取验证码',       //   页面文字
    count: 60,                //   存储倒计时
    buttonDsiable: false,     //   三元禁用按钮
    showAct: false,         //   红包显示
    getText: "领取红包",
    disabled: false,
    aniData: {},
    current: 0,
    tel: true
  },
  onLoad() {
    var animation = my.createAnimation({
      duration: 100,
    });
    this.animation = animation;
    this.setData({
      aniData: animation.export()
    });
    my.getStorage({
      key: 'userId', // 缓存数据的key
      success: (res) => {
        this.setData({ userId: res.data })
      },
    });
  },
  onShow() {
    console.log(1)
    my.getStorage({
      key: 'telephone', // 缓存数据的key
      success: (res) => {
        console.log(2)
        console.log(res.data)
        if (res.data == "" || res.data == undefined) {
          console.log('执行if')
          this.setData({ telephone: res.data })
        } else {
          console.log('执行else')
          this.setData({ tel: false })
        }
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
        key: 'telephone',
        data: res.res.sa_phone
      })

      my.confirm({
        title: '温馨提示',
        content: '绑定成功',
        confirmButtonText: '确定',
        success: (res) => {
          let promoters = my.getStorageSync({
            key: 'promoters', // 缓存数据的key
          }).data;
          this.setData({ promoters: promoters })
          if (promoters) {
            that.setData({ showAct: true })
          } else {
            my.navigateBack({});
          }
        },
      });
    })
  },
  // 获取红包
  getReward() {
    this.animation.rotate(10).step();
    this.animation.rotate(-10).step();
    this.animation.rotate(10).step();
    this.animation.rotate(-10).step();
    this.animation.rotate(0).step();
    this.setData({ aniData: this.animation.export() })
    let url = '/miniprogram/redpackage';
    let userId = my.getStorageSync({
      key: 'userId', // 缓存数据的key
    }).data;
    let params = {
      type: 1,
      userName: userId
    }
    app.req.requestPostApi(url, params, this, res => {
      this.setData({
        getText: '恭喜您获得' + res.res + '元,已放入钱包',
        disabled: true,
        current: 1
      })
    })
  },
  // 点击取消跳转到页面
  toRecharge() {
    this.setData({
      showAct: false
    })
    let cacheTime = my.getStorageSync({
      key: 'cacheTime', // 缓存数据的key
    }).data;
    this.setData({ cacheTime: cacheTime })
    if (cacheTime > Date.parse(new Date())) {
      my.navigateTo({ url: '/page/groundRecharge/groundRecharge' });
    } else {
      my.navigateBack({
      });
    }
  }
});


