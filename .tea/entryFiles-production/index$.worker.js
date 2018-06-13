require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../page/login/login');
require('../../page/register/register');
require('../../page/userService/userService');
require('../../page/getback/getback');
require('../../page/school/school');
require('../../page/index/index');
require('../../page/mine/mine');
require('../../page/person/person');
require('../../page/wallet/wallet');
require('../../page/comment_list/comment_list');
require('../../page/comment/comment');
require('../../page/recharge/recharge');
require('../../page/record/record');
require('../../page/refund/refund');
require('../../page/swingCard/swingCard');
require('../../page/cardReader/cardReader');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
