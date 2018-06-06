//app.js
var constant = require('./service/macro.js');
var req = require('./service/request.js');
var common = require('./service/common.js');
var md5 = require('./service/md5.js');
App({
  onLaunch() {
  },
  globalData: {
    userInfo: null
  },
  common: common,
  req: req,
  md5: md5
});
