
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../page/index/index');
require('../../page/person/person');
require('../../page/bindNum/bindNum');
require('../../page/school/school');
require('../../page/mine/mine');
require('../../page/wallet/wallet');
require('../../page/comment_list/comment_list');
require('../../page/comment/comment');
require('../../page/recharge/recharge');
require('../../page/record/record');
require('../../page/swingCard/swingCard');
require('../../page/cardReader/cardReader');
require('../../page/schoolNew/schoolNew');
require('../../page/groundRecharge/groundRecharge');
require('../../page/webview/webview');
require('../../page/baituH5/baituH5');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
