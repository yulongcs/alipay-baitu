
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../page/index/index');
require('../../page/mine/mine');
require('../../page/person/person');
require('../../page/wallet/wallet');
require('../../page/comment_list/comment_list');
require('../../page/comment/comment');
require('../../page/swingCard/swingCard');
require('../../page/cardReader/cardReader');
require('../../page/bindNum/bindNum');
require('../../page/record/record');
require('../../page/refund/refund');
require('../../page/recharge/recharge');
require('../../page/groundRecharge/groundRecharge');
require('../../page/school/school');
require('../../page/schoolNew/schoolNew');
require('../../page/operation/operation');
require('../../page/waterThat/waterThat');
require('../../page/cardThat/cardThat');
require('../../page/webview/webview');
require('../../page/baituH5/baituH5');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
