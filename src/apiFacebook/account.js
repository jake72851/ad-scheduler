const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
const CONFDB = require('../config/db');
const db = require('../db/connect');
const dayjs = require('dayjs');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (userId, accountId, pageId) {
  // 계정정보 확인
  const account = new AdAccount(accountId);

  // 계정별 정보 확인
  const readFields = [
    'account_id',
    'account_status',
    'age',
    'amount_spent',
    'attribution_spec',
    'balance',
    'business',
    'business_name',
    'created_time',
    'fb_entity',
    'funding_source',
    'funding_source_details',
    'id',
    'io_number',
    'line_numbers',
    'media_agency',
    'min_campaign_group_spend_cap',
    'min_daily_budget',
    'name',
    'offsite_pixels_tos_accepted',
    'owner',
    'partner',
    'spend_cap',
  ]; // 정보가 없는 field의 경우 항목없음
  const params = {
    // effective_status: ['ACTIVE', 'PAUSED'],
    filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  const accountInfo = await account.read(readFields, params);

  const vad = await db.connection(CONFDB.DB.NAME);
  const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);
  const data = {
    userId,
    apiId: 'adAccounts',
    dataType: 'info',
    accountInfo: accountInfo._data,
    createdDay: dayjs().format('YYYY-MM-DD'),
    createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
  };
  await userFacebook.updateOne(
    { userId: data.userId, apiId: data.apiId, dataType: data.dataType, createdDay: data.createdDay },
    { $set: data },
    { upsert: true }
  );
};