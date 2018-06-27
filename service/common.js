var md5 = require('./md5.js');
var macro = require('./macro.js');
var obj = {};
// var openid;

function createSign(obj){
  this.obj = obj;
  var signArray  = [];

  for(var key in this.obj){
    signArray.push(key + '=' + this.obj[key])  ;
  }

  var sign = signArray.sort().join('&') + '&key=' + macro.key;
  var new_sign = md5.hexMD5(sign).toUpperCase();
  return new_sign;
}
/* 微信小程序获取openId用法（openId = 用户标识
function getOpenId(){
  openid =  wx.getStorageSync('openid');
  return openid;
}
*/ 


module.exports = {
  createSign,
  // getOpenId  
}
