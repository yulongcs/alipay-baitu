var app = getApp();
Page({

  data: {
    schoolList: [],      //  学校列表
    inputVal: '',        //  获取输入框的值
    account: '',         //  userID
    schoolName: '',       //  学校名称
    cardNo: '',           //  虚拟卡号
    actoken:'',           //  令牌

  },
  // load函数
  onLoad: function (options) {
    var that = this;
    var url = '/miniprogram/getAllSchools';
    var params = null;
    app.req.requestPostApi(url, params, this, function (res) {
      that.setData({
        schoolList: res.res
      })
    })
  },
  // 输入事件
  onInput(e) {
    let that = this;
    console.log(e);
    that.setData({
      onInput: true,
      inputVal: e.detail.value // 获取输入框的值s
    })
  },
  // 表单提交
  sub: function (e) {
    var that = this;
    var inputVal = e.detail.value.schoolInput;   // 输入值传递给后台获取搜索结果
    var url = "/miniprogram/getAllSchools";
    var params = {
      schoolName: inputVal,
    }
    // 调用网络接口
    app.req.requestGetApi(url, params, this, function (res) {
      that.setData({
        onInput: false,
        schoolList: res.res,
      })
    })
  },
  // 获取学校
  selectSchool: function (e) {
    let account = my.getStorage({
      key: 'userId', // 缓存数据的key
      success: (res) => {
        this.setData({ account: res.data })
      },
    });
    let actoken = my.getStorage({
      key: 'actoken', // 缓存数据的key
      success: (res) => {
        this.setData({ actoken: res.data })
      },
    });
    var obj = { id: e.target.id, account: this.data.account }
    let url = '/alipay/miniprogram/register'
    let params = { schoolId: obj.id, account: obj.account, accessToken: this.data.actoken }
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      my.alert({
        title: '提示',
        content: '选错学校设备会不能用的哦',
        success: () => {
          let that = this;
          let url = '/alipay/miniprogram/autologin';
          let params = { account: obj.account };
          // 网络请求
          app.req.requestPostApi(url, params, this, res => {
            console.log(res);
            let schoolName = my.setStorage({
              key: 'schoolName', // 缓存数据的key
              data: res.res.schoolName, // 要缓存的数据
              success: (res) => {
                console.log(res)
                that.setData({ schoolName: res.data })
              },
            });
            let cardNo = my.setStorage({
              key: 'cardNo', // 缓存数据的key
              data: res.res.cardNo, // 要缓存的数据
              success: (res) => {
                console.log(res)
                that.setData({ cardNo: res.data })
              },
            });
            my.reLaunch({
              url: '/page/index/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          })
        }
      })
    })
  },
})