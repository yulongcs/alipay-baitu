const app = getApp();
var interval; //  动画倒计时
var polling;  //  开启动画轮询
var QR = require('../../service/qrcode.js');
Page({
  data: {
    screenHeight: 0,
    screenWidth: 0,
    ratio: 0, //比率：screenWidth/750

    info: [],//广告位轮播

    current: 0,//功能swiper页
    show: true,//功能bar

    username: '',//username,接口参数
    mac: '',//mac地址

    showType: true,//扫一扫与二维码转换

    showMode: false,
    showClose: false,

    hotMode: [],//模式
    modeName: '',
    waterType: 1,//选择开水器模式
    WasherType: 1,//选择洗衣机模式
    blowerType: 1,//选择吹风机模式
    dryerType: 1,//选择烘干机模式

    dryPrice: '',//单脱
    fastPrice: '',//快速
    stdPrice: '',//标准
    bigPrice: '',//大物

    state: 0,//状态，0：空闲，1：运行中
    tradeNO: '',//订单号
  },
  onLoad() {
    // 调用获取宽度高度
    this.getInfo();
    /* 缓存值判断用户什么入口进入 跳转相应页面 */
    my.getStorage({
      key: 'page',
      success: (res) => {
        if (res.data && res.data !== 'undefined') {
          my.navigateTo({
            url: res.data
          });
        } else {
          my.getStorage({
            key: 'mac',
            success: (res) => {
              if (res.data && res.data !== 'undefined') {
                this.setData({
                  mac: res.data
                })
                this.getType()
              }
            },
          });
        }
      },
    });
    // 获取授权 auth_base 静默授权
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        // 拿授权的值，请求url登录接口
        let authCode = res.authCode;
        let params = { authCode: authCode }
        let url = '/alipay/miniprogram/grantLogin';
        app.req.requestPostApi(url, params, this, res => {
          /* 接口返回值 支付宝用户标识 电话号码 actoken废弃  */
          let userId = res.res.UserId;
          let phone = res.res.phone;
          let actoken = res.res.AccessToken;
          // 赋值给初始化数据的userId
          this.setData({ userId: userId })
          // 缓存便于个人信息页显示
          my.setStorage({
            key: 'userId',
            data: userId,
          });
          my.setStorage({
            key: 'actoken',
            data: actoken,
          })
          // 根据返回值判断  10002 则未注册账号，进入选择学校页
          if (res.message == "10002") {
            my.navigateTo({
              url: '/page/school/school'
            });
            // 10001 为已经注册的账号 执行登录接口
          } else if (res.message == "10001") {
            let url = '/alipay/miniprogram/autologin';
            let params = { account: this.data.userId, };
            // 网络请求
            app.req.requestPostApi(url, params, this, res => {
              my.getStorage({
                key: 'userId', // 缓存数据的key
                success: (res) => {
                  this.setData({ userId: res.data })
                  this.getAdInfo();
                },
              });
              let that = this;
              // 根据返回值判断 电话是否为空 显示不同 便于个人信息页手机绑定
              if (res.res.phone == 'null') {
                my.setStorage({
                  key: 'telephone',
                  data: '',
                })
              } else {
                my.setStorage({
                  key: 'telephone',
                  data: res.res.phone
                })
              }
              /* 缓存接口返回值 用户id 学校名称 虚拟卡号  */
              my.setStorageSync({
                key: 'id',
                data: res.res.id,
              });
              my.setStorageSync({
                key: 'schoolName',
                data: res.res.schoolName,
              });
              my.setStorageSync({
                key: 'cardNo',
                data: res.res.cardNo,
              });
            })
          }
        })
      }
    })
  },
  // bar 功能以及swiper联动
  show(e) {
    if (e.target.id == 'scan') {
      this.setData({
        showType: true,
        show: true
      })
    } else {
      this.setData({
        showType: false,
        show: false
      })
      this.drawQRCode();
    };
  },
  // 扫码功能
  scan() {
    let that = this;
    var mac;
    my.scan({
      success: (res) => {
        // 扫描二维码
        if (res.code.indexOf('mac=') >= 0) {
          mac = res.code.split('mac=')[1];
          if (mac.indexOf('#') >= 0) {
            mac = mac.split('#')[0];
          }
        }
        //  扫描小程序码
        else if (res.path) {
          if (res.path.indexOf('mac=')) {
            mac = res.path.split('mac=')[1];
            if (mac.indexOf('#') >= 0) {
              mac = mac.split('#')[0];
            }
          }
        }
        // 支付宝直接扫码
        else if (res.code.indexOf('mac%3D') >= 0) {
          mac = res.code.split('mac%3D')[1];
          if (mac.indexOf('#') >= 0) {
            mac = mac.split('#')[0];
          }
        }
        // 二维码内容直接为mac地址
        else {
          mac = res.code;
        }
        that.setData({
          mac: mac
        })
        that.getType();
      }
    });
  },
  // 获取模式
  getType() {
    var that = this;
    let userId = my.getStorageSync({
      key: 'userId', // 缓存数据的key
    }).data;
    this.setData({ userId: userId })
    var time = new Date().getTime();
    var sign = app.common.createSign({
      mac: that.data.mac,
      timestamp: time,
      userName: userId
    });
    var params = {
      mac: that.data.mac,
      timestamp: time,
      userName: userId,
      sign: sign
    }
    app.req.requestPostApi('/miniprogram/machine/scan', params, this, function(res) {
      that.setData({
        modeType: res.res.type,
        modeName: res.res.name,
        showMode: true,
        hotMode: res.res.modeList,
        mac: res.res.mapping,
      })
    })
  },
  // 取消功能
  cancel(e) {
    this.setData({
      showMode: false,
    })
  },
  /* 获取机器模式 */
  getModeType(e) {
    switch (this.data.modeType) {
      case 1:
        this.setData({
          waterType: e.target.id
        })
        this.openHot();
        break;
      case 2:
        this.setData({
          WasherType: e.target.id
        })
        this.openWasher();
        break;
      case 3:
        this.setData({
          blowerType: e.target.id
        })
        this.openBlower();
        break;
      case 4:
        this.setData({
          dryerType: e.target.id
        })
        this.openDryer();
        break;
    }
  },
  /* 开水器支付(已签约免密协议的时候调用 - 不需要拉起收银台开启机器) */
  signed(tradeNO) {
    let url = '/alipay/miniprogram/facepay_open_machine';
    let userId = this.data.userId;
    let parmas = { tradeNo: tradeNO, alipayPid: userId };
    my.removeStorage({ key: 'mac', });
    // 网络请求
    app.req.requestPostApi(url, parmas, this, res => {
      var that = this;
      if (res.res.openType === 1) {
        var time = res.res.missionTime;
        that.setData({
          showMode: false,
          showClose: true
        });
        that.getAraw(time);
        //轮询查询开水器状态
        var time_polling = new Date().getTime();
        var sign_polling = app.common.createSign({
          mac: that.data.mac,
          userName: userId,
          timestamp: time_polling,
        })
        var param_polling = {
          sign: sign_polling,
          timestamp: time_polling,
          mac: that.data.mac,
          userName: userId,
        }
        if (res.res.isPollingEnable) {
          polling = setInterval(() => {
            app.req.requestPostApi('/miniprogram/machine/queryHotState', param_polling, this, res => {
              if (res.res === 1) {
                clearInterval(polling);
                clearInterval(interval);
                that.setData({
                  showClose: false
                });
              }
            }, function(res) {
              clearInterval(polling);
            })
          }, 2000)
        }
      }
      else if (res.res.openType === 2) {
        my.alert({
          title: '温馨提示',
          content: '请按键',
          success: (res) => {
            that.setData({
              showMode: false,
              showClose: true
            });
          },
        });
      }
      else {
        that.setData({
          showMode: false,
          showClose: false,
        });
        my.alert({
          title: '',
          content: res.message,
        })
      }
    })
  },
  /* 开水器支付(不签约免密协议的时候调用 - 需要拉起收银台后开启机器) */
  notSigned(tradeNO) {
    my.tradePay({
      tradeNO: tradeNO,
      success: res => {
        if (res.resultCode == 9000) {
          my.showToast({
            content: '支付成功',
            type: 'success',
            duration: 1000,
            success: res => {
              let url = '/alipay/miniprogram/facepay_open_machine';
              let userId = this.data.userId;
              my.removeStorage({
                key: 'mac',
                success: (res) => {
                  console.log('已删除mac')
                },
              });
              var params = {
                tradeNo: tradeNO,
                alipayPid: userId,
              }
              app.req.requestPostApi(url, params, this, res => {
                var that = this;
                if (res.res.openType === 1) {
                  var time = res.res.missionTime;
                  that.setData({
                    showMode: false,
                    showClose: true
                  });
                  that.getAraw(time);
                  //轮询查询开水器状态
                  var time_polling = new Date().getTime();
                  var sign_polling = app.common.createSign({
                    mac: that.data.mac,
                    userName: userId,
                    timestamp: time_polling,
                  })
                  var param_polling = {
                    sign: sign_polling,
                    timestamp: time_polling,
                    mac: that.data.mac,
                    userName: userId,
                  }
                  if (res.res.isPollingEnable) {
                    polling = setInterval(() => {
                      app.req.requestPostApi('/miniprogram/machine/queryHotState', param_polling, this, res => {
                        if (res.res === 1) {
                          clearInterval(polling);
                          clearInterval(interval);
                          that.setData({
                            showClose: false
                          });
                        }
                      }, function(res) {
                        clearInterval(polling);
                      })
                    }, 2000)

                  }
                }
                else if (res.res.openType === 2) {
                  my.alert({
                    title: '温馨提示',
                    content: '请按键',
                    success: (res) => {
                      that.setData({
                        showMode: false,
                        showClose: true
                      });
                    },
                  });
                }
                else {
                  that.setData({
                    showMode: false,
                    showClose: false,
                  });
                  my.alert({
                    title: '',
                    content: res.message,
                  })
                }
              })
            }
          })
        } else if (res.resultCode == 4000) {
          my.showToast({
            content: '订单支付失败',
            type: 'fail',
            duration: 1000,
          })
        } else if (res.resultCode == 6001) {
          my.showToast({
            content: '订单中途取消',
            type: 'fail',
            duration: 1000,
          })
        }
      }
    })
  },
  // 开水器预支付
  openHot() {
    let userId = this.data.userId;
    let mapping = this.data.mac;
    let modeId = this.data.waterType;
    let url = '/alipay/miniprogram/facepay';
    let params = { alipayPid: userId, mapping: mapping, modeId: modeId };
    // 网络请求
    app.req.requestPostApi(url, params, this, res => {
      let tradeNO = res.res.tradeNo;
      let balanceOf = res.res.is_money_enough;
      let withHold = res.res.is_alipay_withhold_sign;
      // 判断 用户余额是否充足  为true 
      if (balanceOf) {
        // 为true 直接开启设备（不需要拉起支付窗口）
        this.signed(tradeNO)
        // 用户余额不充足的情况下 为false
      } else {
        // 判断用户是否签约免密支付协议
        if (withHold) {
          // 为true的时候 直接开启设备(不需要开拉起支付窗口)
          this.signed(tradeNO)
          // 为false的时候 提醒用户签约免密支付协议
        } else {
          my.confirm({
            title: '温馨提示',
            content: '您是否开通免密支付?',
            confirmButtonText: '马上签约',
            cancelButtonText: '暂不需要',
            success: res => {
              // 用户点击马上签约以后 执行签约功能 跳转至内嵌页面
              if (res.confirm) {
                let url = '/alipay/miniprogram/get_withhold_sign_str';
                let userId = this.data.userId;
                let params = { userName: userId }
                // 选择签约后的网络请求
                app.req.requestPostApi(url, params, this, res => {
                  let signStr = res.res;
                  // 获取签约字符串 返回结果
                  my.paySignCenter({
                    signStr: signStr,
                    success: res => {
                      console.log(JSON.stringify(res));
                    }
                  });
                })
              } else {
                // 未签约选择后 调用拉起支付窗口进行支付
                this.notSigned(tradeNO);
              }
            },
          })
        }
      }

    })
  },
  // 关闭开水器
  endHot() {
    var that = this;
    let userId = this.data.userId;
    let url = '/miniprogram/machine/stophot';
    var time = new Date().getTime();
    var sign = app.common.createSign({
      mac: that.data.mac,
      timestamp: time,
      userName: userId
    });
    var params = {
      userName: userId,
      timestamp: time,
      mac: that.data.mac,
      sign: sign
    };
    app.req.requestPostApi(url, params, this, res => {
      clearInterval(interval);
      clearInterval(polling);
      that.setData({
        showClose: false
      });
    }, function(res) {
      clearInterval(interval)
      that.setData({
        showClose: false
      });
    })

  },
  // 直接出水模式打水动画
  getAraw(t) {
    var that = this;
    var step = 2;
    interval = setInterval(function() {
      var start = Math.PI * 1.5, end, n = t; //初始角度，终止角度,时间
      if (step <= n) {
        end = step / n * 2 * Math.PI + 3 / 2 * Math.PI;
        that.draw(start, end)
        step++;
      } else {
        clearInterval(interval)
        clearInterval(polling)
        that.setData({
          showClose: false
        })
        my.confirm({
          title: "温馨提示",
          content: '再打一次',
          success: (res) => {
            if (res.confirm) {
              that.openHot();
            }
          },
        });
      }
    }, 1000)
  },
  // 洗衣机 包含签约
  getWasher() {
    let that = this;
    let userId = this.data.userId;
    let mapping = this.data.mac;
    let modeId = this.data.WasherType;
    let url = '/alipay/miniprogram/facepay';
    let params = { alipayPid: userId, mapping: mapping, modeId: modeId };

    app.req.requestPostApi(url, params, this, res => {
      let tradeNO = res.res.tradeNo;
      let balanceOf = res.res.is_money_enough;
      let withHold = res.res.is_alipay_withhold_sign;
      // 判断 用户余额是否充足  为true 
      if (balanceOf) {
        // 为true 直接开启设备（不需要拉起支付窗口）
        this.generalPay(tradeNO)
        // 用户余额不充足的情况下 为false
      } else {
        // 判断用户是否签约免密支付协议
        if (withHold) {
          // 为true的时候 直接开启设备(不需要开拉起支付窗口)
          this.generalPay(tradeNO)
          // 为false的时候 提醒用户签约免密支付协议
        } else {
          my.confirm({
            title: '温馨提示',
            content: '您是否开通免密支付?',
            confirmButtonText: '马上签约',
            cancelButtonText: '暂不需要',
            success: res => {
              // 用户点击马上签约以后 执行签约功能 跳转至内嵌页面
              if (res.confirm) {
                let url = '/alipay/miniprogram/get_withhold_sign_str';
                let userId = this.data.userId;
                let params = { userName: userId }
                // 选择签约后的网络请求
                app.req.requestPostApi(url, params, this, res => {
                  let signStr = res.res;
                  // 获取签约字符串 返回结果
                  my.paySignCenter({
                    signStr: signStr,
                    success: res => {
                      console.log(JSON.stringify(res));
                    }
                  });
                })
              } else {
                // 未签约选择后 调用拉起支付窗口进行支付
                this.generalNopay(tradeNO);
              }
            },
          })
        }
      }
    })
  },
  // 吹风机 包含签约
  getBlower() {
    let that = this;
    let userId = this.data.userId;
    let mapping = this.data.mac;
    let modeId = this.data.blowerType;
    let url = '/alipay/miniprogram/facepay';
    let params = { alipayPid: userId, mapping: mapping, modeId: modeId };

    app.req.requestPostApi(url, params, this, res => {
      let tradeNO = res.res.tradeNo;
      let balanceOf = res.res.is_money_enough;
      let withHold = res.res.is_alipay_withhold_sign;
      // 判断 用户余额是否充足  为true 
      if (balanceOf) {
        // 为true 直接开启设备（不需要拉起支付窗口）
        this.generalPay(tradeNO)
        // 用户余额不充足的情况下 为false
      } else {
        // 判断用户是否签约免密支付协议
        if (withHold) {
          // 为true的时候 直接开启设备(不需要开拉起支付窗口)
          this.generalPay(tradeNO)
          // 为false的时候 提醒用户签约免密支付协议
        } else {
          my.confirm({
            title: '温馨提示',
            content: '您是否开通免密支付?',
            confirmButtonText: '马上签约',
            cancelButtonText: '暂不需要',
            success: res => {
              // 用户点击马上签约以后 执行签约功能 跳转至内嵌页面
              if (res.confirm) {
                let url = '/alipay/miniprogram/get_withhold_sign_str';
                let userId = this.data.userId;
                let params = { userName: userId }
                // 选择签约后的网络请求
                app.req.requestPostApi(url, params, this, res => {
                  let signStr = res.res;
                  // 获取签约字符串 返回结果
                  my.paySignCenter({
                    signStr: signStr,
                    success: res => {
                      console.log(JSON.stringify(res));
                    }
                  });
                })
              } else {
                // 未签约选择后 调用拉起支付窗口进行支付
                this.generalNopay(tradeNO);
              }
            },
          })
        }
      }
    })
  },
  // 烘干机 包含签约
  getDryer() {
    let that = this;
    let userId = this.data.userId;
    let mapping = this.data.mac;
    let modeId = this.data.blowerType;
    let url = '/alipay/miniprogram/facepay';
    let params = { alipayPid: userId, mapping: mapping, modeId: modeId };

    app.req.requestPostApi(url, params, this, res => {
      let tradeNO = res.res.tradeNo;
      let balanceOf = res.res.is_money_enough;
      let withHold = res.res.is_alipay_withhold_sign;
      // 判断 用户余额是否充足  为true 
      if (balanceOf) {
        // 为true 直接开启设备（不需要拉起支付窗口）
        this.generalPay(tradeNO)
        // 用户余额不充足的情况下 为false
      } else {
        // 判断用户是否签约免密支付协议
        if (withHold) {
          // 为true的时候 直接开启设备(不需要开拉起支付窗口)
          this.generalPay(tradeNO)
          // 为false的时候 提醒用户签约免密支付协议
        } else {
          my.confirm({
            title: '温馨提示',
            content: '您是否开通免密支付?',
            confirmButtonText: '马上签约',
            cancelButtonText: '暂不需要',
            success: res => {
              // 用户点击马上签约以后 执行签约功能 跳转至内嵌页面
              if (res.confirm) {
                let url = '/alipay/miniprogram/get_withhold_sign_str';
                let userId = this.data.userId;
                let params = { userName: userId }
                // 选择签约后的网络请求
                app.req.requestPostApi(url, params, this, res => {
                  let signStr = res.res;
                  // 获取签约字符串 返回结果
                  my.paySignCenter({
                    signStr: signStr,
                    success: res => {
                      console.log(JSON.stringify(res));
                    }
                  });
                })
              } else {
                // 未签约选择后 调用拉起支付窗口进行支付
                this.generalNopay(tradeNO);
              }
            },
          })
        }
      }
    })
  },
  // 预支付不拉起收银台开启设备
  generalPay(tradeNO) {
    let url = '/alipay/miniprogram/facepay_open_machine';
    let userId = this.data.userId;
    let params = { tradeNo: tradeNO, alipayPid: userId };
    my.removeStorage({ key: 'mac', });
    app.req.requestPostApi(url, params, this, res => {
      console.log(JSON.stringify(res))
      my.showToast({
        content: '机器开启成功',
        type: 'success',
        duration: 1000,
      });
    })
  },
  // 预支付拉起收银台开启设备
  generalNopay(tradeNO) {
    my.tradePay({
      tradeNO: tradeNO,
      success: (res) => {
        if (res.resultCode == 9000) {
          my.showToast({
            type: 'success',
            content: '支付成功',
            duration: 1000,
            success: (res) => {
              let url = '/alipay/miniprogram/facepay_open_machine';
              let userId = this.data.userId;
              let params = {
                tradeNo: tradeNO,
                alipayPid: userId,
              }
              app.req.requestPostApi(url, params, this, res => {
                that.setData({
                  showMode: false
                })
                my.showToast({
                  title: '机器开启成功',
                })
              })
            },
          });
        } else if (res.resultCode == 4000) {
          my.showToast({
            type: 'fail',
            content: '支付失败',
            duration: 1000,
          });
        } else if (res.resultCode == 6001) {
          my.showToast({
            type: 'fail',
            content: '已取消支付',
            duration: 1000,
          });
        }
      },
    });
  },
  // 开启洗衣机 调用预支付函数
  openWasher() {
    this.getWasher();
  },
  // 开启吹风机 调用预支付函数
  openBlower() {
    this.getBlower();
  },
  // 开启烘干机 调用预支付函数
  openDryer() {
    this.getDryer();
  },
  // 绘制图形
  draw(s, e) {
    var x = this.data.screenWidth / 2,
      y = this.data.screenWidth / 2,
      radius = this.data.screenWidth / 3 + 3;
    var cxt_arc = my.createCanvasContext('scan');//创建并返回绘图上下文context对象。
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径
    cxt_arc.arc(x, y, radius, s, e, false);
    cxt_arc.stroke();//对当前路径进行描边

    cxt_arc.draw();
  },
  // 获取设备信息
  getInfo() {
    var that = this;
    my.getSystemInfo({
      success(res) {
        that.setData({
          screenHeight: res.screenHeight,
          screenWidth: res.windowWidth,
          pixelRatio: res.windowWidth / 750
        })
      },
    })
  },
  // 获取广告位信息
  getAdInfo() {
    var that = this;
    let userId = this.data.userId;
    let url = '/miniprogram/ad/adList';
    var time = new Date().getTime();
    var sign = app.common.createSign({
      userName: userId,
      timestamp: time
    })
    var params = {
      userName: userId,
      timestamp: time,
      sign: sign
    }
    app.req.requestPostApi(url, params, this, res => {
      that.setData({
        info: res.res
      })
    })
  },
  // 跳转到H5页面
  jumpTo(e) {
    switch (e.currentTarget.dataset.info) {
      case 0:
        break;
      case 1:
        my.setStorageSync({
          key: 'nav',
          data: e.currentTarget.dataset.url,
        });
        my.navigateTo({
          url: '/page/webview/webview?id=' + e.currentTarget.dataset.id,
        })
        break;
      case 2:
        my.navigateTo({ url: '/page/operation/operation' });
        break;
    }
  },
  // 二维码绘制 
  drawQRCode() {
    var that = this;
    let userId = this.data.userId;
    var time = new Date().getTime();
    var sign = app.common.createSign({
      userName: userId,
      timestamp: time
    });
    var params = {
      userName: userId,
      timestamp: time,
      sign: sign
    };
    app.req.requestPostApi('/miniprogram/stu/qrcode', params, this, function(res) {
      var size = that.setCanvasSize();
      var initUrl = res.message;
      that.createQrCode(initUrl, "qrcode", size.w, size.h);
    })
  },
  // 适配不同屏幕大小的canvas
  setCanvasSize() {
    var size = {};
    try {
      var res = my.getSystemInfoSync();
      var width = res.windowWidth;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  // 调用插件中的draw方法，绘制二维码图片
  createQrCode(url, canvasId, cavW, cavH) {
    QR.qrApi.draw(url, canvasId, cavW, cavH);
  },
});
