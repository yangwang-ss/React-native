import { stringify } from 'qs';
import request from '../utils/request';
/**
 *  登录信息
 */
export function login(code = '') {
  if (!code) {
    return false;
  }
  return request(`/api/v1/user/login?code=${code}`);
}
export function sendSVC(mobile) {
  return request(`/api/v1/user/sendSVC?mobile=${mobile}`);
}

export function register({ code, mobile, verificationCode }) {
  return request('/api/v1/user/register', {
    method: 'POST',
    data: {
      code,
      mobile,
      verificationCode,
    },
  });
}

export function getUserData(code) {
  return request(`/api/v1/user/checkInvitationCode?code=${code}`);
}

export function getSplashImg() {
  return request('/api/v1/index/indexStartupPage');
}
export function getSplashImg2() {
  return request('/api/v1/index/indexStartupPage2');
}
/**
 *  信息收集
 */
export function getPersonLike(params) {
  return request(`/api/v1/user/update?sex=${params.sex}&age=${params.age}`);
}

/**
 *  首页
 */

export function getTopTabs() {
  return request('/api/v1/index/navigation/categories');
}
export function getBanners() {
  return request('/api/v1/index/banners');
}
export function getActiveCategory(position) {
  return request(`/api/v2/index/subject/banners?position=${position}`);
}
export function getIndexProducts({ page = 1, pageSize = 10 }) {
  return request(`/api/v2/index/products?pageNo=${page}&pageSize=${pageSize}`);
}
export function getParentCategory(parentId) {
  return request(`/api/v1/platformCategory/children?parentId=${parentId}`);
}
export function hurryBuy({ pageNo, pageSize = 10 }) {
  return request(`/api/v1/product/list/hurryBuy?pageNo=${pageNo}&pageSize=${pageSize}`);
}
export function getPrdByCategoryId({ categoryId, sort, deviceValue, deviceType, page, pageSize = 10, hasCoupon }) {
  return request(
    `/api/v1/product/listByCategoryId?categoryId=${categoryId}&sort=${sort}&deviceValue=${deviceValue}&deviceType=${deviceType}&pageNo=${page}&pageSize=${pageSize}&hasCoupon=${hasCoupon}`
  );
}
export function getPrdByGuessLike({ page = 1, pageSize = 10 }) {
  return request(`/api/v2/index/guessLike/products?pageNo=${page}&pageSize=${pageSize}`);
}
export function getVipType() {
  return request('/api/v1/index/vipTip');
}
export function getSearchText(text) {
  return request('/api/v1/product/explainTxt', {
    method: 'POST',
    data: { tpwdTxt: text },
  });
}
export function getNotice() {
  return request('/api/v1/index/topLine');
}

/**
 *  商品详情
 */
export function getPrdDetail(pid, src) {
  return request(`/api/v1/product/detail?id=${pid}&src=${src}`);
}
export function getPrdFavor(pid, cname) {
  return request(`/api/v1/product/detail/guessLike?id=${pid}&categoryLeafName=${cname}`);
}
export function addCollectPrd(pid) {
  return request(`/api/v1/product/addCollectProduct?id=${pid}`);
}
export function deleteCollectPrd(pid) {
  return request(`/api/v1/product/deleteCollectProduct?id=${pid}`);
}
export function getPrdShareImg(pid) {
  return request(`/api/v1/share/productImg?productId=${pid}`);
}
export function getPrdShopInfo(shopTitle) {
  return request(`/api/v1/product/shopInfo?shopTitle=${shopTitle}`);
}

/**
 *  个人中心
 */
// 收藏商品列表
export function getCollectPrd(params) {
  return request(`/api/v1/product/collectProducts?pageNo=${params.page}&pageSize=${params.pageSize}`);
}

export function refreshUserInfo() {
  return request('/api/v1/user/getUserInfo');
}
export function getMoneyCount() {
  return request('/api/v1/account/statistics');
}

// 今日预计收益
export function getProfitAmount() {
  return request('/api/v2/user/estimate/day/amount');
}

export function getSaleProfit(params) {
  return request(`/api/v2/user/estimate/day/sales?curPage=${params}&pageSize=10`);
}

export function getTeamProfit(params) {
  return request(`/api/v2/user/estimate/day/team?curPage=${params}&pageSize=10`);
}

export function getStoreProfit(params) {
  return request(`/api/v2/user/estimate/day/manager?curPage=${params}&pageSize=10`);
}

export function getOrderProfit(params) {
  return request(`/api/v2/user/estimate/day/store?curPage=${params}&pageSize=10`);
}

// 提现
export function widthDraw(money) {
  return request('/api/v1/account/withdraw', {
    method: 'POST',
    data: {
      money,
    },
  });
}
// 我的好友
export function myFriend(page) {
  return request(`/api/v1/user/myFriend?current=${page}&size=10`);
}
export function myFriendCount() {
  return request('/api/v1/user/myFriendCount');
}

/**
 *  种草社区
 */
export function getCommunity(params) {
  return request(`/community/list?${stringify(params)}`);
}

/**
 *  搜索
 */
// 搜索联想词
export function getAssociationalWords(params) {
  return request(`/api/v1/product/associationalWords?keyword=${params}`);
}
// 搜索热词
export function getHotwords() {
  return request('/api/v1/product/hotwords');
}
// 搜索商品
export function getSearchPrd(params) {
  return request('/api/v2/product/searchNew', {
    method: 'POST',
    data: params,
  });
}
// 搜索猜你喜欢
export function getSearchGuessLike(params) {
  return request(`/api/v1/product/search/guessLike?os=${params.os}&idfa=${params.idfa}&imei=${params.imei}&apnm=${params.apnm}&net=${params.net}&pageNo=1&pageSize=10`);
}
export function getChargeSearch(params) {
  return request('/api/v2/product/charge/search', {
    method: 'POST',
    data: params,
  });
}

/**
 *  地址
 */
export function addressData() {
  return request('/api/v1/area/list');
}

/**
 *  会员
 */
export function establishParent(invitationCode = 'qwerdf') {
  return request(`/api/v1/user/binding?invitationCode=${invitationCode}`);
}
export function orderConfirmData(pid) {
  return request(`/api/v1/vipProduct/checkout?id=${pid}`);
}
export function vipOrderConfirm(params) {
  return request('/api/v1/vipOrder/create', {
    method: 'POST',
    data: params,
  });
}
export function vipOrderDetail(id = '') {
  if (!id) {
    return false;
  }
  return request(`/api/v1/vipOrder/detail?id=${id}`);
}
export function logistics(orderId = '') {
  return request(`/api/v1/vipOrder/logistics?orderId=${orderId}`);
}
export function vipOrderList() {
  return request('/api/v1/vipOrder/list');
}
export function vipOrderReceive(orderId) {
  return request(`/api/v1/vipOrder/confirm?orderId=${orderId}`);
}
export function getWechatCode() {
  return request('/api/v1/user/wxNO');
}
export function vipBuyUpdate() {
  return request('/direct-upgrading/create');
}
export function vipRightNew() {
  return request('/api/v1/user/vipRightNew');
}

/**
 * 我的订单
 */
// 金额
export function backMoney() {
  return request('/api/v1/tbk/order/amount');
}
// 支付成功
export function paySuccess(params) {
  return request(`/api/v1/storeOrder/paySuccess?orderId=${params}`);
}
// 所待返现订单
export function myWaitOrder(page) {
  return request(`/api/v1/tbk/order/wait?curPage=${page}&pageSize=10`);
}

// 所有订单
export function myAllOrder(page) {
  return request(`/api/v1/tbk/order/all?curPage=${page}&pageSize=10`);
}

// 已返现订单
export function myAwardOrder(page) {
  return request(`/api/v1/tbk/order/awarded?curPage=${page}&pageSize=10`);
}
export function myInvalidOrder(page) {
  return request(`/api/v1/tbk/order/invalid?curPage=${page}&pageSize=10`);
}

export function vipProductList() {
  return request('/api/v1/vipProduct/list');
}

export function vipProductDetail(id) {
  return request(`/api/v1/vipProduct/detail?id=${id}`);
}

// 月收益
export function monthFitList() {
  return request('/api/v2/user/estimate/month');
}
// 年收益
export function historyFitList() {
  return request('/api/v2/user/estimate/year');
}

// 我的收藏列表
export function collectList(page) {
  return request(`/api/v1/product/collectProducts?pageNo=${page}&pageSize=6`);
}
// 钱包明细
export function drawDetails(page) {
  return request(`/api/v1/account/details?curPage=${page}&pageSize=5`);
}

// 添加微信号
export function updateWeixin(value) {
  return request(`/api/v1/user/updateWeixin?value=${value}`);
}

// 审核中
export function waitAmount() {
  return request('/api/v2/user/estimate/all/wait/amount');
}
export function waitSales(page) {
  return request(`/api/v2/user/estimate/all/wait/sales?curPage=${page}&pageSize=10`);
}
export function waitTeams(page) {
  return request(`/api/v2/user/estimate/all/wait/teams?curPage=${page}&pageSize=10`);
}
export function waitStore(page) {
  return request(`/api/v2/user/estimate/all/wait/manager?curPage=${page}&pageSize=10`);
}
export function waitOrder(page) {
  return request(`/api/v2/user/estimate/all/wait/store?curPage=${page}&pageSize=10`);
}
/**
 * 高佣商品
 */
export function getCommissionPrdList(page) {
  return request(`/api/v1/vipProduct/list?pageNo=${page}&pageSize=10`);
}
export function getCommissionPrdDetail(pid) {
  return request(`/api/v1/vipProduct/detail?id=${pid}`);
}
export function getCommissionPrdShareImg(pid) {
  return request(`/api/v1/share/vipProductImg?productId=${pid}`);
}

// 邀好友图片
export function getInviteImg(pid) {
  return request('/api/v1/share/invitationImg');
}
// 会员banenr
export function getVipRight() {
  return request('/api/v1/user/vipRight');
}

export function appVersionControlCheck() {
  return request('/api/v1/appVersionControl/check');
}

// 社区分享+1
export function socialShareImg(id) {
  return request(`/community/share?id=${id}`);
}

// 九块九专区
export function getNineProduct(params) {
  return request(
    `/api/v1/product/list/nine?&sort=${params.sort}&deviceValue=${params.deviceValue}&deviceType=${params.deviceType}&pageNo=${params.page}&pageSize=${params.pageSize}&hasCoupon=${params.hasCoupon}`
  );
}

export function checkVersion() {
  return request('/api/v1/iosAppReview/checkVersion');
}

export function mobileLogin({ mobile, pw }) {
  return request(`/api/v1/iosAppReview/mobileLogin?mobile=${mobile}&pw=${pw}`);
}

export function saveDetail(id, pics) {
  return request('/api/v1/product/savePics', {
    method: 'POST',
    data: {
      id,
      pics,
    },
  });
}

export function tbbcBinding(params) {
  return request('/api/v1/tbbc/binding', {
    method: 'POST',
    data: params,
  });
}

export function expainUrl(url) {
  return request('/api/v2/product/expainUrl', {
    method: 'POST',
    data: {
      url,
    },
  });
}

export function validUrls() {
  return request('/api/v2/product/validUrls');
}

// 合伙人
export function getPartnerBanner() {
  return request('/direct-upgrading/checkout');
}
export function iosAppReviewSendSVC(mobile) {
  return request(`/api/v1/mobileLogin/sendSVC?mobile=${mobile}`);
}

export function iosAppReviewLogin({ mobile, verificationCode }) {
  return request(`/api/v1/mobileLogin/login`, {
    method: 'post',
    data: {
      mobile,
      verificationCode,
    },
  });
}

// 获取好友每个级别的  数量
export function friendCountGroupRoleId() {
  return request('/api/v1/user/friendCountGroupRoleId');
}

// 好友筛选接口
export function getFriendCount(page, sortType, sortParams, vipType, roleId) {
  if (sortType == 'roleId') {
    return request(`/api/v1/user/friend?current=${page}&size=10&${sortType}=${sortParams}&descs=invitation_date`);
  }
  if (sortType != 'roleId' && vipType) {
    return request(`/api/v1/user/friend?current=${page}&size=10&${sortType}=${sortParams}&roleId=${roleId}`);
  }
  return request(`/api/v1/user/friend?current=${page}&size=10&${sortType}=${sortParams}`);
}

// 惠拼钱包
export function getHpMoneyCount() {
  return request('/api/v1/account/hpyx/balance');
}

// 惠拼提现
export function hpWidthDraw(params) {
  return request('/api/v1/account/hpyx/withdraw', {
    method: 'POST',
    data: params,
  });
}

// 邀请分享图
export function getInvitationShare() {
  return request('/api/v1/share/shareMemberStyle');
}

// 邀请分享图选择
export function getShareImgChoose(params) {
  return request(`/api/v1/share/shareMemberImg?style=${params}`);
}

export function sharePoster() {
  return request('/api/v1/share/poster');
}
// 社区tag
export function getcommunityTag() {
  return request('/community-tag/list');
}

export function getcommunityTab3List(params) {
  return request(`/community-multi-media/list?search=${params.search || ''}&tagId=${params.tagId || ''}&currentPage=${params.currentPage}`);
}
// 新手教程列表
export function getCourseVideoList(params) {
  return request(`/community-multi-media/videos?tagId=${params.tagId}&currentPage=${params.page}`);
}

// 获取淘口令
export function getTKL(pid) {
  return request(`/api/v1/product/tpwdModel?id=${pid}`);
}
// 阅读数+1
export function readCount(id) {
  return request(`/community-multi-media/readAdd?id=${id}`);
}
export function shareCopywriting() {
  return request('/api/v1/share/shareCopywriting');
}

// 合伙人记录--服务商身份
export function getMyReferrals(params) {
  return request('/api/v1/user/agent/partner/search', {
    method: 'POST',
    data: params,
  });
}
// 合伙人记录--服务商身份--店长身份
export function getStoreMyReferrals(params) {
  return request('/api/v1/user/store/partner/search', {
    method: 'POST',
    data: params,
  });
}
// 获取当前用户发展的合伙人人数--服务商身份
export function getPartners() {
  return request('/api/v1/user/agent/partners');
}

// 获取当前用户发展的合伙人人数--店长身份
export function getStorePartners() {
  return request('/api/v1/user/store/partners');
}

// 获取某个用户团队的订单数--服务商身份
export function getTeamOrders(uid) {
  return request(`/api/v1/user/agent/partner/orders?userId=${uid}`);
}

// 获取某个用户团队的订单数--店长身份
export function getStoreTeamOrders(uid) {
  return request(`/api/v1/user/store/partner/orders?userId=${uid}`);
}

// 升级某人为合伙人--服务商身份
export function upPartner(id) {
  return request(`/api/v1/user/agent/up/partner?userId=${id}`);
}

// 升级某人为合伙人--店长身份
export function storeUpPartner(id) {
  return request(`/api/v1/user/store/up/partner?userId=${id}`);
}

// 获取当前用户开通合伙人数量信息--服务商身份
export function upCounts() {
  return request('/api/v1/user/agent/up/count');
}

// 获取当前用户开通合伙人数量信息--店长身份
export function storeUpCounts() {
  return request('/api/v1/user/store/up/count');
}

export function isTbAuth() {
  return request('/api/v1/user/isTbAuth');
}

export function shoppingCartCount(ids = []) {
  return request('/api/v1/shoppingcart/count', {
    method: 'POST',
    data: ids,
  });
}
// 广告位
export function getAdImgs() {
  return request('/api/v1/index/ads');
}

export function appErrorLog(params) {
  return request('/api/v1/appErrorLog/save', {
    method: 'POST',
    data: {
      text: JSON.stringify(params),
    },
  });
}

// 意见反馈
export function getSuggestion(params) {
  return request('/api/v1/user/feedback/save', {
    method: 'POST',
    data: params,
  });
}

// 获取新人专区url
export function getProductUrl(params) {
  return request(`/new/activity/valid?id=${params}`);
}

// 门店订单
export function getStoreOrderList(params) {
  return request(`/api/v1/storeOrder/customerOrderList?current=${params}&size=10`);
}

// 门店订单详情
export function getStoreOrderDetail(params) {
  return request(`/api/v1/storeOrder/customerOrderInfo?orderId=${params}`);
}

// 店长订单
export function getOrderList(params) {
  return request(`/api/v1/storeOrder/storeOrderList?current=${params.currentPage}&size=10&status=${params.type}&keyWord=${params.keyWord}`);
}

// 店长订单详情
export function getOrderDetail(params) {
  return request(`/api/v1/storeOrder/storeOrderInfo?orderId=${params}`);
}

// 确认收货
export function getReceiving(params) {
  return request(`/api/v1/storeOrder/completeOrder?orderId=${params}`);
}

// 发货
export function getDeliverGoods(params) {
  return request(`/api/v1/storeOrder/deliverOrder?orderId=${params}`);
}

// 商品销售数据用户列表
export function getGoodsSaleUserList(params) {
  return request(`/api/v1/store/goods/buyers?goodsId=${params.pid}&pageNo=${params.currentPage}&pageSize=10`);
}

// 商品销售数据详情
export function getGoodsSaleDetail(params) {
  return request(`/api/v1/store/goods/detail?goodsId=${params}`);
}

// 商品管理
export function getGoodsLists(params) {
  return request(`/api/v1/store/goodsList?type=${params.type}&pageNo=${params.pageNo}&pageSize=10`);
}
// 商品下架
export function goodsOut(params) {
  return request(`/api/v1/goods/shelveGoods?id=${params}`);
}
// 商品删除
export function goodsDelete(params) {
  return request(`/api/v1/goods/deleteGoods?id=${params}`);
}
// 店铺商品详情
export function getStorePrdDetail(pid) {
  return request(`/api/v1/goods/detail?id=${pid}`);
}
// 门点入口判断
export function judgeShopPage() {
  return request('/api/v1/store/judge');
}

// 店铺列表
export function shopList() {
  return request('/api/v1/store/list');
}

// 店铺详情 店铺信息
export function shopDetailInfo(shopId) {
  return request(`/api/v1/store/detail?storeId=${shopId}`);
}
// 店铺详情 店铺推荐商品
export function shopDetailRecommendGoods(shopId) {
  return request(`/api/v1/store/today/recommendGoods?storeId=${shopId}`);
}
// 店铺详情 店铺商品列表
export function shopDetaiPlist(shopId, page) {
  return request(`/api/v1/goods/list?storeId=${shopId}&pageNo=${page}&pageSize=12`);
}
// 店铺内搜索商品
export function shopDetailSearch(shopId, value) {
  return request(`/api/v1/goods/search?storeId=${shopId}&pageNo=1&pageSize=12&keyword=${value}`);
}
// 统计分享次数
export function shareStoreTime(id) {
  return request(`/api/v1/store/shareStore?id=${id}`);
}
// 确认订单，订单信息
export function confirmOrder(id) {
  return request(`/api/v1/storeOrder/confirmInfo?goodsId=${id}`);
}
// 确认订单，创建订单
export function createOrder(params) {
  return request('/api/v1/storeOrder/create', {
    method: 'POST',
    data: params,
  });
}
// 商品分享统计
export function saveProShareCount(id) {
  return request(`/api/v1/goods/shareGoods?id=${id}`);
}

// 首页店铺信息
export function getInitStore() {
  return request('/api/v1/store/currentStore');
}
// 今日登入用户
export function todtayUsers(params) {
  return request(`/api/v1/store/member/manage/today/login/${params}/10`);
}
// 店长审核
export function manageReview(params) {
  return request(`/api/v1/user/agent/storeAdmin/examine?current=${params}&size=10`);
}

export function memberManageContacts() {
  return request(`/api/v1/store/member/manage/contacts`);
}

export function memberManageContactsAll(type) {
  return request(`/api/v1/store/member/manage/contacts/all/${type}`);
}

export function memberManageContactsList({ type = 0, curPage = 1, pageSize = 15 }) {
  return request(`/api/v1/store/member/manage/contacts/list`, {
    method: 'POST',
    data: {
      type,
      curPage,
      pageSize,
    },
  });
}

export function sendMobileSize() {
  return request('/api/v1/store/member/manage/contacts/sendMobileSize');
}

export function storeReportByCount() {
  return request(`/api/v1/store/report/form/count`);
}

export function storeReportByTime(type) {
  return request(`/api/v1/store/report/form/time/${type}`);
}
// 会员管理浏览详情
export function getMemberPvProList(params) {
  return request(`/api/v1/store/member/manage/browseList/${params.userId}/${params.currentPage}/10`);
}

// 会员管理详情
export function getMemberPvDetail(userId) {
  return request(`/api/v1/store/member/manage/${userId}/detail`);
}

export function storeReportFromTime(type) {
  return request(`/api/v1/store/report/form/time/${type}`);
}

export function storeAdmin({ current = 1, size = 10, order = 1 }) {
  return request(`/api/v1/user/agent/storeAdmin/list?current=${current}&size=${size}&order=${order}`);
}

export function storeAdminNumber() {
  return request(`/api/v1/user/agent/storeAdmin/number`);
}

export function storeUserInfo(id) {
  return request(`/api/v1/user/agent/storeAdmin/info?userId=${id}`);
}

// 会员管理图标数据
export function lineChartData() {
  return request(`/api/v1/store/member/manage/index/statistics/chart`);
}
// 会员管理数据
export function lineChartHeadData() {
  return request('/api/v1/store/member/manage/index/statistics');
}

// 店铺好友
export function shopFriendList(userTabType, page, sortType, sortParams, vipType, roleId) {
  let params = {};
  let params2 = {};
  if (sortType == 'userLevel') {
    params = {
      invitationSort: 'desc',
    };
  }
  if (sortType != 'userLevel' && vipType) {
    params = {
      userLevel: roleId,
    };
  }

  if (sortType != 'userLevel') {
    if (sortParams == 'invitationSort') {
      params2 = {
        invitationSort: sortType,
      };
    } else {
      params2 = {
        teamNumSort: sortType,
      };
    }
  }

  return request('/api/v1/store/member/manage/index/list', {
    method: 'POST',
    data: {
      type: userTabType,
      curPage: page,
      pageSize: 10,
      ...params,
      ...params2,
    },
  });
}

export function shopMemRoleId() {
  return request('/api/v1/store/member/manage/friendCountGroupRoleId');
}

export function goodsShareImgs(id) {
  return request(`/api/v1/goods/shareImgs?id=${id}`);
}

// 业务员-店长审核
export function getSalesManCheckPending(curPage) {
  return request(`/api/v1/user/salesman/wait/audit/list/${curPage}/10`);
}

// 弹幕
export function getBarrage() {
  return request(`/api/v2/index/barrage`);
}

// 业务员列表
export function getSalesmanList(params) {
  return request(`/api/v1/user/agent/salesman/list`, {
    method: 'POST',
    data: {
      ...params,
      pageSize: 10,
    },
  });
}

// 业务员列表-数量
export function getSalesmanNumber() {
  return request(`/api/v1/user/agent/salesman/count`);
}

// 直升业务员列表
export function getUpSalesmanList(params) {
  return request(`/api/v1/user/agent/salesman/search`, {
    method: 'POST',
    data: {
      ...params,
      pageSize: 10,
    },
  });
}

// 直升业务员
export function upSalesman(id) {
  return request(`/api/v1/user/agent/opening/salesman/${id}`);
}

// 取消业务员
export function cancelSalesman(id) {
  return request(`/api/v1/user/agent/disqualify/${id}`);
}

// 获取直升链接
export function getUpLink() {
  return request(`/api/v1/user/salesman/shopkeeperRise`);
}

// 业务员视角-店长管理
export function getSalesmanShopownerList(params) {
  return request(`/api/v1/user/salesman/storeAdmin/list`, {
    method: 'POST',
    data: {
      ...params,
      pageSize: 10,
    },
  });
}

// 业务员视角-店长数据统计
export function getSalesmanShopownerData() {
  return request(`/api/v1/user/salesman/store/count`);
}

export function newPeopleShareProducts() {
  return request(`/new/activity/share/products`);
}
// 业务员视角-店长信息
export function getSalesmanUserInfo(id) {
  return request(`/api/v1/user/salesman/storeAdmin/info?userId=${id}`);
}

// 判断是否有店铺
export function getIsStore(id) {
  return request(`/api/v1/store/isShowStore?storeId=${id}`);
}
// 商品收藏批量删除
export function deleteBatchCollectProduct(idList) {
  return request(`/api/v1/product/deleteBatchCollectProduct`, {
    method: 'POST',
    data: idList,
  });
}
// 今日榜单
export function rankingList(type) {
  return request(`/api/v2/user/estimate/partner/sales/rankingList?type=${type}`);
}

// 是否绑定微信
export function isBindWechat() {
  return request('/api/v1/account/withdraw/isBindWx');
}

// 绑定微信
export function bindWechat(code) {
  return request(`/api/v1/userWx/binding?code=${code}`);
}

export function qiniuToken() {
  return request('/api/admin/qiniu/token');
}

// 店铺增加商品

export function shopAddGoods(params) {
  return request('/api/v1/goods/add', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 店铺修改商品
export function shopEditGoods(params) {
  return request('/api/v1/goods/edit', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 佣金比例
export function getCommisionByRole(params) {
  return request(`/api/v1/goods/getCommisionByRole?salePrice=${params.salePrice}&couponPrice=${params.couponPrice}&commissionRate=${params.commissionRate}`);
}

// 降价提醒列表
export function getCutPriceList(page) {
  return request(`/api/v1/goods/collect/list?current=${page}&size=6`);
}
// 降价列表批量删除
export function deleteCutPriceList(arr) {
  return request(`/api/v1/goods/collect/batchDelete`, {
    method: 'POST',
    data: arr,
  });
}
// 编辑商品详情 /api/v1/goods/goodsDetails

export function editGoodsD(id) {
  return request(`/api/v1/goods/goodsDetails?id=${id}`);
}

// 市级服务商直升列表
export function getCityRiseList(params) {
  return request(`/api/v1/user/agent/list?status=${params.type}&pageNo=${params.currentPage}&pageSize=10`);
}

// 市级服务商直升数据统计
export function getCityRiseData() {
  return request(`/api/v1/user/agent/count`);
}
