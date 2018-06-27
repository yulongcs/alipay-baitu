const app = getApp();
Page({
  data: {
    username: '',
    mine: [
      { name: "个人信息", url: "../person/person", src: "../../image/list_icon_info.png" },
      { name: "我的钱包", url: "../wallet/wallet", src: "../../image/list_icon_money.png" },
      { name: "意见反馈", url: "../comment_list/comment_list", src: "../../image/list_icon_feedback.png" },
      { name: "刷卡绑定", url: "../swingCard/swingCard", src: "../../image/list_icon_care.png" }
    ]
  },
});
