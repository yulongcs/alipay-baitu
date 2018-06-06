var app = getApp();
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',              //  手机号码
    password: '',            //   密码
    schoolId: 0,             //   学校id
    schoolName: '',         //    学校名称
    registerList: [],       //   存储表单传递值
    codes: '获取验证码',     //   页面文字
    count: 60,              //   存储倒计时
    buttonDsiable: false,             //   三元禁用按钮
  },

  onLoad: function (options) {
    var that = this;
    //   注册通知
    WxNotificationCenter.addNotification('NotificationName', that.didNotification, that)
  },
  /**
  * 通知处理
  */
  didNotification: function (obj) {
    //更新数据
    var that = this;
    that.observer.setData({ schoolId: obj.id, schoolName: obj.name })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    WxNotificationCenter.removeNotification('NotificationName', that)
  },

  // 失败函数统一调用
  Funfail: function (res) {
    console.log(res);
  },

  // 失去焦点事件获取手机号码
  getTel: function (e) {
    var that = this;
    var mobile = e.detail.value;
    that.setData({
      mobile: mobile,
    })
  },

  // 获取密码
  getPsd: function (e) {
    var that = this;
    var password = e.detail.value;
    that.setData({
      password: password,
    })
  },

  // 获取学校列表
  pickSchool() {
    my.navigateTo({
      url: '../school/school'
    });
  },
  // 获取验证码
  getCode: function (e) {
    var that = this;
    var mobile = that.data.mobile;      // 获取手机号码
    var password = that.data.password;  // 获取密码
    var buttonDsiable = that.data.buttonDsiable;          // 获取按钮默认值
    var url = '/miniprogram/sendMessage'  // 调用短信接口
    var params = {
      phoneNum: mobile,    //  传递手机号码参数
      msgType: 'register',  //  传递信息类型
      timestamp: new Date().getTime(),
      // 传递参数的时候 通过sign加密
      sign: app.common.createSign({
        msgType: 'register',   //  传递信息类型        
        phoneNum: mobile,
        timestamp: new Date().getTime(),
      })
    }
    // 调用网络接口
    app.req.requestPostApi(url, params, this, function (res) {
      console.log('短信发送成功');
      my.showToast({
        content: '验证码已发送',
        type: 'success',
        duration: 1000,
      });
      that.setData({
        code: res.res
      })
      var mobile = that.data.mobile;       //  获取手机号
      var timer = setInterval(() => {      //  设置倒计时
        var count = that.data.count - 1;   //  倒计时默认值减1
        that.setData({
          codes: count + 's重新发送',
          count: count,
          buttonDsiable: true,     //  改变默认值禁用
        })
        //  倒计时结束恢复正常
        if (count < 1) {
          clearInterval(timer);
          that.setData({
            count: 59,
            codes: '获取验证码',
            buttonDsiable: false,             // 按钮恢复默认
          })
        }
      }, 1000)
    }, this.Funfail);
  },

  // 表单提交
  baitu_register: function (e) {
    var that = this;
    var mobile = e.detail.value.mobile;         //   获取手机号码
    var password = e.detail.value.password;        //  获取密码
    var code = e.detail.value.code;            //  获取验证码
    var schoolId = parseInt(that.data.schoolId);     //  获取学校ID    
    if (!mobile || !password || !code || schoolId < 1 || !schoolId) {
      my.alert({
        title: 'error',
        content: '请补全信息',
      })
      return;
    }
    var url = "/miniprogram/register"
    var params = {
      account: mobile,
      password: app.md5.hexMD5(app.md5.hexMD5(e.detail.value.password) + '%K8s01&!s'),
      schoolId: schoolId,
      phone: mobile,
      verifyCode: code,
      cardNo: "11111111",
    }
    // 调用网络接口
    app.req.requestPostApi(url, params, this, function (res) {
      //  表单提交成功跳转
      my.redirectTo({
        url: '/page/login/login',
      });
    }, this.Funfail)
  },
})