const app = getApp();
Page({
  data: {
    username: '',            // 
    mobile: '',              //  手机号码
    password: '',            //   密码
    code: '',                //  短信验证码
    codes: '获取验证码',     //   页面文字
    count: 60,              //   存储倒计时
    buttonDsiable: false,   //   三元禁用按钮
  },
  // 获取手机号码
  getTel(e) {
    let that = this;
    let mobile = e.detail.value;
    that.setData({
      mobile: mobile
    })
  },

  // 获取密码
  getPsd(e) {
    let that = this;
    let password = e.detail.value;
    that.setData({
      password: password
    })
  },

  // 获取验证码
  getCode(e) {
    let that = this;
    let mobile = that.data.mobile;
    let password = that.data.password;
    let buttonDisable = that.data.buttonDisable;
    let url = '/miniprogram/sendMessage'
    let params = {
      phoneNum: mobile,
      msgType: 'resetPwd',
      timestamp: new Date().getTime(),
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, (res) => {
      console.log('验证码发送成功');
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
        } else {
          console.log(res);
        }
      }, 1000)
    })
  },

  // 表单提交
  baitu_getBack(e) {
    console.log(e);
    let that = this;
    let mobile = e.detail.value.mobile;
    let password = e.detail.value.password;
    let code = e.detail.value.code;
    let url = '/miniprogram/resetpwd';
    let params = {
      userName: mobile,
      password: app.md5.hexMD5(app.md5.hexMD5(e.detail.value.password) + '%K8s01&!s'),
      verifyCode: code,
    }
    // 网络请求
    app.req.requestPostApi(url, params, this, (res) => {
      my.showToast({
        type: 'success',
        content: '修改密码成功',
        duration: 500,
        success: (res) => {
          my.navigateBack({})
        },
      });

    })
  }
});
