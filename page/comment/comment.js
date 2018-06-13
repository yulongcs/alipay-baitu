const app = getApp();
const qiniu = require('../../utils/qiniu-myapp-sdk/sdk/qiniuUploader.js');
var imagePath = [];
var timeout;
Page({
  data: {
    usernName: '',        // 用户名
    token: '',           //
    domain: '',          //
    title: [],           // 存储标题
    titleId: '',         // 标题ID
    filePath: [],        //
    feedback: '',        //
    image: [],           // 存储图片
  },
  // 获取标题
  getTitle() {
    let that = this;
    let time = new Date().getTime();
    let url = '/miniprogram/feedback/title';
    let params = {
      userName: that.data.userName,
      timestamp: time,
      sign: app.common.createSign({
        userName: that.data.userName,
        timestamp: new Date().getTime(),
      })
    }
    app.req.requestPostApi(url, params, this, function (res) {
      that.setData({
        title: res.res
      })
      console.log(that.data.title);
    })
  },
  // 选择title
  radioChange: function (e) {
    var that = this;
    that.setData({
      titleId: e.detail.value
    })
  },

  // 反馈问题描述
  getText: function (e) {
    var that = this;
    var feedback = e.detail.value;
    that.setData({
      feedback: feedback
    })
  },
  // 上传图片
  upload: function () {
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
        //console.log(that.data.filePath)
      },
    })
  },

  // 七牛云上传图片
  qiniuUpload: function () {
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
  getToken: function () {
    var that = this;
    var time = new Date().getTime();
    var url = '/miniprogram/feedback/qiniu/token';
    var params = {
      userName: that.data.userName,
      timestamp: time,
      sign: app.common.createSign({
        userName: that.data.userName,
        timestamp: new Date().getTime(),
      })
    }
    app.req.requestPostApi(url, params, this, function (res) {
      console.log(res);
      that.setData({
        token: res.res.token,
        domain: res.res.domain,
      })
    });
    return;
  },

  // 提交舆情
  postComment: function () {
    var that = this;
    if (imagePath.length > 0) {
      that.qiniuUpload();
    } else {
      console.log("no Image");
      that.pushComment(null);
    }
  },
  pushComment: function (img) {
    var that = this;
    //console.log(that.data.image, that.data.feedback, that.data.titleId);
    if (!that.data.feedback || !that.data.titleId) {
      my.alert({
        title: 'error',
        content: '请选择问题点并输入反馈',
      });
      return;
    }

    //  获取数组 提交表单
    var arr = [];
    var time = new Date().getTime();
    arr.push('userName=' + that.data.userName, 'timestamp=' + time, 'title_id=' + that.data.titleId, 'description=' + that.data.feedback, 'imgs=' + img);

    var url = '/miniprogram/feedback/commit';
    var params = {
      userName: that.data.userName,
      timestamp: time,
      title_id: that.data.titleId,
      description: that.data.feedback,
      imgs: img,
      sign: app.common.createSign({
        userName: that.data.userName,
        timestamp: time,
        title_id: that.data.titleId,
        description: that.data.feedback,
        imgs: img,
      })
    }

    // 调用网络接口
    app.req.requestPostApi(url, params, this, function () {
      my.navigateBack({
        url: '../comment_list/comment_list'
      })
    })
  },

  onLoad: function () {
    var that = this;
    imagePath.splice(0, imagePath.length)
    my.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          width: res.windowWidth / 4,
        })
      },
    });
    my.getStorage({
      key: 'userName',
      success: function (res) {
        that.setData({
          userName: res.data,
        })
        that.getToken();
        that.getTitle();
      },
    });
  },

  // 监听页面加载
  onUnload: function () {
    clearTimeout(timeout);
  },
});
