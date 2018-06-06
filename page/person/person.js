Page({
  data: {
    tele: '',    //  电话号码
    school: '',  //  学校
  },
  onLoad(options) {
    let that = this;
    my.getStorage({
      key: 'userName', // 缓存数据的key
      success: (res) => {
        that.setData({
          tele: res.data
        })
      },
    });
    my.getStorage({
      key: 'school', // 缓存数据的key
      success: (res) => {
        that.setData({
          school: res.data
        })
      },
    });
  },
});
