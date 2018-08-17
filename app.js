//app.js
var constant = require('./service/macro.js');
var req = require('./service/request.js');
var common = require('./service/common.js');
var md5 = require('./service/md5.js');
App({
  globalData: {
    userInfo: null,
  },
  onLaunch(options) {
    if (!options.query) {
      my.removeStorage({ key: 'mac', });
      my.removeStorage({ key: 'target_page', });
    } else {
      my.setStorage({ key: 'mac', data: options.query.mac });
      my.setStorage({ key: 'page', data: options.query.target_page });
      my.setStorage({ key: 'promoters', data: options.query.ground_promotion_no });
      my.setStorage({ key: 'cacheTime', data: Date.parse(new Date() + 9000000) })
      console.warn(Date.parse(new Date()), Date.parse(new Date()) + 9000000)
    }
  },

  common: common,
  req: req,
  md5: md5
});
