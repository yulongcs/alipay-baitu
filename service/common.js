var md5 = require('./md5.js');
var macro = require('./macro.js');
var obj = {};

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


module.exports = {
  createSign,
}
