const app = getApp();
Page({
  data: {
    userName: '',
    task_uuid: '',
    card: '',
  },
  onLoad(options) {
    let that = this;
    var times = 0;
    var userName = options.userName;
    var task_uuid = options.task_uuid;
    var timess = new Date().getTime();
    var url = '/miniprogram/sign/checkBind';
    var sign = app.common.createSign({
      userName: userName,
      timestamp: timess,
      task_uuid: task_uuid,
    });
    var params = {
      sign: sign,
      userName: userName,
      timestamp: timess,
      task_uuid: task_uuid,
    }
    // 网络请求
    var timer = setInterval(() => {
      if (times <= 15) {
        times++;
        app.req.requestPostApi(url, params, this, (res) => {
          if (res.return) {
            if (res.message == '绑定失败') {
              clearInterval(timer);
              my.alert({
                title: 'error',
                content: '绑卡失败,该卡可能已经被绑定',
                success: (res) => {
                  my.redirectTo({
                    url: '/page/swingCard/swingCard',
                  });
                },
              });
              return;
            }
            my.showToast({
              content: '绑卡成功',
              type: 'sucess',
              duration: 1000,
            });
            clearInterval(timer);
            my.setStorage({
              key: 'card',
              data: res.res.sa_card_no,
            });
            my.redirectTo({
              url: '/page/swingCard/swingCard',
            });
          }
        })
      } else {
        clearInterval(timer);
        my.alert({
          title: 'error',
          content: '绑卡失败',
          success: (res) => {
            my.redirectTo({
              url: '/page/swingCard/swingCard',
            })
          },
        });
      }
    }, 1000)
  },
});
