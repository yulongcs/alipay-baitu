var app = getApp();
Page({
  data: {
    userName: '',
    password: '',
    mac: '',    // 物理码
    screenHeight: ''
  },

 onLoad(options) {
    var that = this;
    that.getInfo();
    var mac = options['mac'];
    if (mac) {
      that.setData({
        mac: mac,
      })
    }
    my.setStorage({
      key: 'mac', // 缓存数据的key
      data: mac, // 要缓存的数据
    });
    my.getStorage({
      key: 'userName', // 缓存数据的key
      success: (res) => {
        that.setData({ userName: res.data })
      },
    });
  },
    /**
   * 获取设备信息
   */
  getInfo: function () {
    var that = this;
    my.getSystemInfo({
      success: function (res) {
        console.log(res.screenHeight,res.windowHeight);
        that.setData({
          screenHeight: res.windowHeight ,
          screenWidth: res.windowWidth,
          pixelRatio: res.windowWidth / 750
        })
      },
    })
  },
  // 登录提交
  login_submit(e) {
    var that = this;
    var params = e.detail.value;
    params['password'] = app.md5.hexMD5(app.md5.hexMD5(e.detail.value.password) + '%K8s01&!s');
    var url = '/miniprogram/login';
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      my.setStorage({
        key: 'userName', // 缓存数据的key
        data: res.res.account, // 要缓存的数据
      });
      my.setStorage({
        key: 'school',
        data: res.res.schoolName,
      });
      my.setStorage({
        key: "id",
        data: res.res.id,
      });
      my.setStorage({
        key: 'card', // 缓存数据的key
        data: res.res.cardNo, // 要缓存的数据
      });
      my.switchTab({
        url: '../index/index',
      });
    })
  },

  // 跳转忘记密码
  forgetPsd() {
    let that = this;
    my.navigateTo({
      url: "/page/getback/getback"
    });
  },
  // 跳转到注册
  register() {
    let that = this;
    my.navigateTo({
      url: '/page/register/register'
    })
  },

  // 自动登录
  autoLogin() {
    var that = this;
    var url = '/miniprogram/autologin';
    var params = {
      account: that.data.userName,
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      my.switchTab({
        url: '../index/index',
      });
    })
  },
  onReady() {
    var that = this;
    var userName = my.getStorage({
      key: 'userName', // 缓存数据的key
      success: (res) => {
        that.setData({ userName: res.data })
      },
    });
    this.autoLogin();
  },
});
