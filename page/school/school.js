var app = getApp();
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js')
Page({

  data: {
    schoolList: [],      //  学校列表
    inputVal: '',        //  获取输入框的值

  },
  // load函数
  onLoad: function (options) {
    var that = this;
    var url = '/miniprogram/getAllSchools';
    var params = null;
    app.req.requestPostApi(url, params, this, function (res) {
      console.log('拉去学校列表成功')
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
      console.log(that.data.schoolList)
    })
  },
  // 获取学校
  selectSchool: function (e) {
    var obj = {
      id: e.target.id,
      name: e.target.dataset.text,
    }
    my.alert({
      title: '提示',
      content: '选错学校设备会不能用的哦',
      success: function (res) {
        WxNotificationCenter.postNotificationName('NotificationName', obj)
        my.navigateBack({})
      }
    })
  },
})