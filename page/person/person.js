Page({
  data: {
    nickName: '',    //  电话号码
    school: '',  //  学校
  },
  onLoad() {
    let that = this;
    my.getStorage({
      key: 'nickName', // 缓存数据的key
      success: (res) => {
        that.setData({
          nickName: res.data
        })
      },
    });
    my.getStorage({
      key: 'schoolName', // 缓存数据的key
      success: (res) => {
        that.setData({
          schoolName: res.data
        })
      },
    });
  },
});
