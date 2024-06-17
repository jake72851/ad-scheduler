const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const AdSetInsight = require('../controllers/facebook/insight/adSet');
const wait = require('waait');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
// const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (userId, accountId, pageId, termDay) {
  const waitTime = 500;

  // breakdown이 지정되지 않은 기본
  await AdSetInsight.reqBreakdown(userId, accountId, termDay, '', '');

  // 기본 breakdown 조최
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN.length; i++) {
    // 오류가 발생하는 breakdown는 제외
    if (CONF.FACEBOOK.BREAKDOWN[i] !== 'image_asset, video_asset') {
      await AdSetInsight.reqBreakdown(userId, accountId, termDay, CONF.FACEBOOK.BREAKDOWN[i], '');
    }
    await wait(waitTime);
  }

  // 기본 action breakdown 조최
  for (let i = 0; i < CONF.FACEBOOK.ACTION_BREAKDOWN.length; i++) {
    // 오류가 발생하는 action breakdown는 제외
    // if (CONF.FACEBOOK.ACTION_BREAKDOWN[i] !== 'action_carousel_card_id, action_carousel_card_name, action_type') {
    await AdSetInsight.reqBreakdown(userId, accountId, termDay, '', CONF.FACEBOOK.ACTION_BREAKDOWN[i]);
    // }
    await wait(waitTime);
  }

  // 다이내믹 크리에이트브 요소별 breakdown
  for (let i = 0; i < CONF.FACEBOOK.DYNAMIC_BREAKDOWN.length; i++) {
    if (
      CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i] !==
        'image_asset, video_asset, action_carousel_card_id, action_carousel_card_name' &&
      CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i] !== 'image_asset, action_carousel_card_id, action_carousel_card_name' &&
      CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i] !== 'video_asset, action_carousel_card_id, action_carousel_card_name'
    ) {
      await AdSetInsight.reqBreakdown(userId, accountId, termDay, CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i], '');
    }
    await wait(waitTime);
  }

  // 조합 BREAKDOWN_AND_ACTION_BREAKDOWN 조회
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN.length; i++) {
    if (CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].break !== 'image_asset, video_asset') {
      // if (
      //   CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].action !==
      //   'action_carousel_card_id, action_carousel_card_name, action_type'
      // ) {
      await AdSetInsight.reqBreakdown(
        userId,
        accountId,
        termDay,
        CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].break,
        CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].action
      );
      // }
    }
    await wait(waitTime);
  }

  // 조합 BREAKDOWN_AND_DYNAMIC_BREAKDOWN 이 없음
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN.length; i++) {
    await AdSetInsight.reqBreakdown(
      userId,
      accountId,
      termDay,
      CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN[i].break +
        ', ' +
        CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN[i].dynamic,
      ''
    );
    await wait(waitTime);
  }
};
