const app = getApp();
Page({
  data: {
    screenHeight: 0,
    ratio: 0,
    userId: '',

    re_array: [],
    co_array: [],
    show: true,//联动bar
    current: 0,//联动swiper

    re_page: 1,
    co_page: 1,
    pageNum: 15,

    re_loading: '点击加载',
    co_loading: '点击加载',

    state: true,//消费记录完成状态
  },
  /**
  * 选择消费swiper-item
  */
  select(e) {
    if (e.target.id == 'rech') {
      this.setData({
        show: true,
        current: 0
      })
    } else {
      this.setData({
        show: false,
        current: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    this.setSwiperHeight();
    my.getStorage({
      key: 'userId',
      success: (res) => {
        that.setData({
          userId: res.data
        })
        that.getRecharge(1)
        that.getConsumption(1)
      },
    })
  },

  /**
   * 获取设备信息
   */
  setSwiperHeight() {
    var that = this;
    my.getAuthUserInfo({
      success: (res) => {
        that.setData({
          screenHeight: res.windowHeight,
          ratio: res.screenWidth / 750
        })
      },
    })
  },
  /**
   * 获取充值，消费信息
   */
  getRecharge(page) {
    var that = this;
    var time = new Date().getTime();
    var sign = app.common.createSign({
      timestamp: time,
      userName: that.data.userId,
      pn: page,
      ps: that.data.pageNum
    })
    var params = {
      userName: that.data.userId,
      timestamp: time,
      pn: page,
      ps: that.data.pageNum,
      sign: sign
    }
    app.req.requestPostApi('/miniprogram/stu/rechargeorders', params, this, (res) => {
      that.setData({
        re_loading: '点击加载'
      })
      if (res.res.length == 0) {
        return;
      }
      var array = that.data.re_array;
      for (var i = 0; i < res.res.length; i++) {
        //后端数据坑，需要自己解时间
        var date = new Date(res.res[i].timestamp);
        var month = date.getMonth() + 1;
        var minute = date.getMinutes();
        if (minute < 10) {
          minute = '0' + minute;
        }
        res.res[i].timestamp = date.getFullYear() + '-' + month + '-' + date.getDate() + ' ' + date.getHours() + ':' + minute;
        array.push(res.res[i]);
      }
      that.setData({
        re_array: array,
        re_page: page
      })
    })
  },
  getConsumption(page) {
    var that = this;
    var time = new Date().getTime();
    var sign = app.common.createSign({
      timestamp: time,
      userName: that.data.userId,
      pn: page,
      ps: that.data.pageNum
    });
    var params = {
      userName: that.data.userId,
      timestamp: time,
      pn: page,
      ps: that.data.pageNum,
      sign: sign
    }
    app.req.requestPostApi('/miniprogram/stu/useorders', params, this, (res) => {
      that.setData({
        co_loading: '点击加载'
      })
      if (res.res.length == 0) {
        return;
      }
      var array = that.data.co_array;
      for (var i = 0; i < res.res.length; i++) {
        array.push(res.res[i]);
      }
      that.setData({
        co_array: array,
        co_page: page
      })
    })
  },
  /**
   * 加载充值，消费记录
   */
  fresh(e) {
    if (e.target.id == 're_loading') {
      this.setData({
        re_loading: '加载中...'
      })
      var page = this.data.re_page + 1;
      this.getRecharge(page);
    } else {
      this.setData({
        co_loading: '加载中...'
      })
      var page = this.data.co_page + 1;
      this.getConsumption(page);
    }
  },
  /**
   * swiper滑动事件
   */
  changeSwiper(e) {
    if (e.detail.current == 1) {
      this.setData({
        current: 1,
        show: false
      })
    } else {
      this.setData({
        current: 0,
        show: true
      })
    };
  },
});
