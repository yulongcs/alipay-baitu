const app = getApp();
Page({
  data: {
    nickName: '',     //用户昵称
    id: '',           //用户ID
    school: '',       //学校
  },
  onShow() {
    let that = this;
    my.getStorage({
      key: 'nickName', // 缓存数据的key
      success: (res) => {
        that.setData({ nickName: res.data })
      },
    });
    my.getStorage({
      key: 'schoolName', // 缓存数据的key
      success: (res) => {
        that.setData({ schoolName: res.data })
      },
    });
    my.getStorage({
      key: 'id',// 缓存数据的key
      success: res => {
        that.setData({ id: res.data })
      }
    })
    my.getStorage({
      key: 'telephone', // 缓存数据的key
      success: (res) => {
        that.setData({ telephone: res.data })
      },
    });
  },
  // 跳转到绑定号码页面
  bindTel(){
    my.navigateTo({
      url:'/page/bindNum/bindNum'
    });
  },
});
