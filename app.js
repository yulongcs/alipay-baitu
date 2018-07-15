//app.js
var constant = require('./service/macro.js');
var req = require('./service/request.js');
var common = require('./service/common.js');
var md5 = require('./service/md5.js');
App({
  globalData: {
    userInfo: null,
    mac:'',
  },
  onLaunch(options) {
    let that = this;
    if (!options.query) {
      my.removeStorage({
        key: 'mac',
        success: (res) => {
         return false 
        },
      });
    } else {
      my.setStorage({
        key: 'mac',
        data: options.query.mac,
      });
    }
  },

  common: common,
  req: req,
  md5: md5
});
