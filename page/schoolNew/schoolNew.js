var app = getApp();
Page({

  data: {
    schoolList: [],      //  学校列表
    inputVal: '',        //  获取输入框的值
  },
  // load函数
  onLoad() {
    var that = this;
    var url = '/miniprogram/getAllSchools';
    var params = null;
    app.req.requestPostApi(url, params, this, res => {
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
  sub(e) {
    var that = this;
    var inputVal = e.detail.value.schoolInput;   // 输入值传递给后台获取搜索结果
    var url = "/miniprogram/getAllSchools";
    var params = {
      schoolName: inputVal,
    }
    // 调用网络接口
    app.req.requestGetApi(url, params, this, res => {
      that.setData({
        onInput: false,
        schoolList: res.res,
      })
    })
  },
  // 获取学校
  selectSchool(e) {
    let id = e.target.id
    my.confirm({
      title: '温馨提示',
      content: '选错学校设备将无法使用',
      confirmButtonText: '确定选择',
      cancelButtonText: '取消选择',
      success: (res) => {
        if (res.confirm) {
          let url = '/miniprogram/edit_school';
          let userId = my.getStorageSync({
            key: 'userId', // 缓存数据的key
          }).data;
          let time = new Date().getTime()
          let sign = app.common.createSign({
            userName: userId,
            timestamp: time,
            new_school_id: id,
          })
          let params = {
            userName: userId,
            timestamp: time,
            new_school_id: id,
            sign: sign
          }

          app.req.requestPostApi(url, params, this, res => {
            my.confirm({
              title: '温馨提示',
              content: res.message,
              confirmButtonText:"确定",
              success: res => {
                my.navigateBack({});
              }
            })
          })
        }
      },
    });
  },
})