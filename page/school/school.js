var app = getApp();
Page({

  data: {
    schoolList: [],      //  学校列表
    inputVal: '',        //  获取输入框的值
    account: '',         //  userID
    schoolName: '',       //  学校名称
    cardNo: '',           //  虚拟卡号
    actoken: '',           //  令牌

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
    let account = my.getStorage({
      key: 'userId', // 缓存数据的key
      success: (res) => {
        this.setData({ account: res.data })
        console.log(this.data.userId)
      },
    });
    let actoken = my.getStorage({
      key: 'actoken', // 缓存数据的key
      success: (res) => {
        this.setData({ actoken: res.data })
      },
    });
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
  selectSchool(e) {
    var obj = { id: e.target.id, account: this.data.account }
    let url = '/alipay/miniprogram/register'
    let params = { schoolId: obj.id, account: obj.account, accessToken: this.data.actoken }
    // 网络请求'
    my.confirm({
      title: '温馨提示',
      content: '选错学校设备将无法使用',
      confirmButtonText: '确定选择',
      cancelButtonText: '取消选择',
      success: (res) => {
        if (res.confirm) {
          app.req.requestPostApi(url, params, this, res => {
            let schoolName = my.setStorage({
              key: 'schoolName',
              data: res.res.schoolName,
              success: (res) => {
                that.setData({ schoolName: res.data })
              },
            });
            let cardNo = my.setStorage({
              key: 'cardNo',
              data: res.res.cardNo,
              success: (res) => {
                that.setData({ cardNo: res.data })
              },
            });
            my.reLaunch({
              url: '/page/index/index',
            });
          })
        } else {
          return;
        }
      },
    });
  },
})