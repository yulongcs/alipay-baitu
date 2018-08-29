const app = getApp();
Page({
  data: {
    username: '',
    mine: [
      { name: "个人信息", url: "../person/person", src: "../../image/list_icon_info.png" },
      { name: "我的钱包", url: "../wallet/wallet", src: "../../image/list_icon_money.png" },
      { name: "意见反馈", url: "../comment_list/comment_list", src: "../../image/list_icon_feedback.png" },
      { name: "刷卡绑定", url: "../swingCard/swingCard", src: "../../image/list_icon_care.png" },
    ] 
  },
  // // 跳转到H5
  // goH5(){
  //   my.navigateTo({
  //     url:'/page/baituH5/baituH5?https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017110909825266&scope=auth_user&redirect_uri=https%3A%2F%2Fapp.hzchengshan.cn%2Ffunction%2Fschool%2Fschool.html&state=hahahah'
  //   });
  // }
});
