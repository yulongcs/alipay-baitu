const app = getApp();
const qiniu = require('../../utils/qiniu-myapp-sdk/sdk/qiniuUploader.js');
var imagePath = [];
var timeout;
Page({
  data: {
    userId: '',        // 用户名
    token: '',           //
    domain: '',          //
    title: [],           // 存储标题
    titleId: '',         // 标题ID
    filePath: [],        //
    feedback: '',        //
    image: [],           // 存储图片
  },
  // 生命周期函数 页面加载完成
  onLoad() {
    let that = this;
    imagePath.splice(0, imagePath.length)
    my.getSystemInfo({
      success: (res) => {
        console.log(res)
        that.setData({
          width: res.windowWidth / 4,
        })
      },
    });
    let userId = my.getStorageSync({
      key: 'userId', // 缓存数据的key
    }).data;
    that.setData({ userId: userId })
    that.getToken();
    that.getTitle();
  },
  // 监听页面加载
  onUnload() {
    clearTimeout(timeout);
  },
  // 获取标题
  getTitle() {
    let that = this;
    let time = new Date().getTime();
    let url = '/miniprogram/feedback/title';
    let params = {
      userName: that.data.userId,
      timestamp: time,
      sign: app.common.createSign({
        userName: that.data.userId,
        timestamp: new Date().getTime(),
      })
    }
    app.req.requestPostApi(url, params, this, res => {
      that.setData({
        title: res.res
      })
    })
  },
  // 选择title
  radioChange(e) {
    var that = this;
    that.setData({
      titleId: e.detail.value
    })
  },

  // 反馈问题描述
  getText(e) {
    var that = this;
    var feedback = e.detail.value;
    that.setData({
      feedback: feedback
    })
  },
  // 上传图片
  upload() {
    var that = this;
    my.chooseImage({
      count: 3,
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (var i = 0; i < res.apFilePaths.length; i++) {
          if (imagePath.length < 3) {
            imagePath.push(res.apFilePaths[i]);
          }
        }
        that.setData({
          filePath: imagePath
        })
      },
    })
  },

  // 七牛云上传图片
  qiniuUpload() {
    var that = this;
    var image = [];
    for (var i = 0; i < imagePath.length; i++) {
      qiniu.upload(imagePath[i], (res) => {
        image.push('alipay' + '/' + res.imageURL)
      }, (error) => {
        console.log('error:' + error);
      }, {
          region: 'ECN',
          domain: that.data.domain,
          uptoken: that.data.token
        })
    }
    timeout = setTimeout(function () {
      that.pushComment(image.join(','));
    }, 1200)
  },

  // 获取token
  getToken() {
    var that = this;
    var time = new Date().getTime();
    var url = '/miniprogram/feedback/qiniu/token';
    var params = {
      userName: that.data.userId,
      timestamp: time,
      sign: app.common.createSign({
        userName: that.data.userId,
        timestamp: new Date().getTime(),
      })
    }
    app.req.requestPostApi(url, params, this, res => {
      console.log(res);
      that.setData({
        token: res.res.token,
        domain: res.res.domain,
      })
    });
    return;
  },

  // 提交舆情
  postComment() {
    var that = this;
    if (imagePath.length > 0) {
      that.qiniuUpload();
    } else {
      console.log("no Image");
      that.pushComment(null);
    }
  },
  pushComment(img) {
    var that = this;
    if (!that.data.feedback || !that.data.titleId) {
      my.alert({
        title: '温馨提示',
        content: '请选择问题点并输入反馈',
      });
      return;
    }

    //  获取数组 提交表单
    var arr = [];
    var time = new Date().getTime();
    arr.push('userName=' + that.data.userId, 'timestamp=' + time, 'title_id=' + that.data.titleId, 'description=' + that.data.feedback, 'imgs=' + img);

    var url = '/miniprogram/feedback/commit';
    var params = {
      userName: that.data.userId,
      timestamp: time,
      title_id: that.data.titleId,
      description: that.data.feedback,
      imgs: img,
      sign: app.common.createSign({
        userName: that.data.userId,
        timestamp: time,
        title_id: that.data.titleId,
        description: that.data.feedback,
        imgs: img,
      })
    }

    // 调用网络接口
    app.req.requestPostApi(url, params, this, res => {
      my.navigateBack({
        url: '../comment_list/comment_list'
      })
    })
  },
});
