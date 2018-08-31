const app = getApp()
Page({
  data: {
    url: '',
    ad_id: '',
    startTime: 0,
    endTime: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let url = my.getStorageSync({
      key: 'nav', // 缓存数据的key
    }).data;
    this.setData({ url: url, ad_id: options.id })
    let startTime = new Date().getTime();
    this.setData({ startTime: startTime })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    let endTime = new Date().getTime()
    let time = this.data.startTime - endTime
    console.log(time)
  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload() {
    let endTime = new Date().getTime();
    let timeOn = endTime - this.data.startTime;
    var model, system;
    my.getSystemInfo({
      success: (res) => {
        console.log(res);
        model = res.model;
        system = res.system;
      },
    });
    let stuId = my.getStorageSync({ key: 'id', }).data;
    let device = app.md5.hexMD5(model + system);
    let sign = app.common.createSign({
      student_id: stuId,
      device_id: device,
      time_on: timeOn,
      type: 1,
      target_id: this.data.ad_id,
      timestamp: endTime,
    })
    let params = {
      student_id: stuId,
      device_id: device,
      time_on: timeOn,
      type: 1,
      target_id: this.data.ad_id,
      timestamp: endTime,
      sign: sign
    }
    let url = 'https://ad.zjbaitu.cn/ad/click';
    // 请求上报接口 支付宝小程序 不会替换掉 之前的url，只会拼接 故而不使用封装
    my.httpRequest({
      url: url,
      data: params,
      method: "POST",
      dataType: 'JSON',
      headers: { 'Content-Type': 'application/json' },
      success: (res) => { },
    });
  }
});
