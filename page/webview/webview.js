// pages/webview/webview.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    ad_id: '',
    startTime: 0,
    endTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      url:options.url,
      ad_id: options.id
    });
    var startTime = new Date().getTime();
    console.log(startTime)
    this.setData({
      startTime: startTime
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var endTime = new Date().getTime();
    var time = this.data.startTime - endTime;
    console.log(time)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var endTime = new Date().getTime();
    var timeOn = endTime - this.data.startTime;
    var model,system;
    wx.getSystemInfo({
      success: function(res) {
        model = res.model;
        system = res.system;
      },
    });
    var openid = wx.getStorageSync('openid');
    var stuId = wx.getStorageSync('id');
    var device = app.md5.hexMD5(model+system+openid);
    var sign = app.common.createSign({
      student_id: stuId,
      device_id:  device,
      time_on: timeOn,
      type:1,
      target_id:this.data.ad_id,
      timestamp: endTime,
    });
    var params = {
      student_id: stuId,
      device_id: device,
      time_on: timeOn,
      type: 1,
      target_id: this.data.ad_id,
      timestamp: endTime,
      sign:sign
    };
    var url = "https://ad.zjbaitu.cn/ad/click";
    app.req.requestPostApi(url,params,this,function(res){
      // console.log(res);
    })
  },
})