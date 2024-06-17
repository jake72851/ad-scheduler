const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');
const dayjs = require('dayjs');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

// 계정별 ads 확인
exports.request = async function (userId, accountId, pageId) {
  const account = new AdAccount(accountId);
  const fields = [
    'account_id',
    'ad_review_feedback',
    'adlabels',
    'adset',
    'adset_id',
    'bid_amount',
    'campaign',
    'campaign_id',
    'configured_status',
    'conversion_domain',
    'conversion_specs',
    'created_time',
    'creative',
    'effective_status',
    'id',
    'issues_info',
    'last_updated_by_app_id',
    'name',
    'source_ad',
    'source_ad_id',
    'status',
  ];
  const params = {
    filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let ads = await account.getAds(fields, params);

  const result = [];
  ads.map((element) => result.push(element._data));

  while (ads.hasNext()) {
    ads = await ads.next();
    ads.map((element) => result.push(element._data));
  }

  // const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  // const userFacebook = vad.collection('user_' + userId + '_facebook');
  const vad = await db.connection(CONFDB.DB.NAME);
  const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);

  for (const [index, value] of result.entries()) {
    const data = {
      userId,
      apiId: 'ads',
      dataType: 'info',
      adsNum: index,
      adsInfo: value,
      createdDay: dayjs().format('YYYY-MM-DD'),
      createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
    };
    await userFacebook.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        adsNum: data.adsNum,
        createdDay: data.createdDay,
      },
      { $set: data },
      { upsert: true }
    );
  }
};

// console.log('ads =', ads);
/* 여러개 있을수 있음
ads = [
  Ad {
    _data: {
      account_id: '2607869862847972',
      adset: [Object],
      adset_id: '23853001024970516',
      campaign: [Object],
      campaign_id: '23853001024860516',
      configured_status: 'ACTIVE',
      conversion_specs: [Array],
      created_time: '2023-02-24T14:51:38+0900',
      creative: [Object],
      effective_status: 'ACTIVE',
      id: '23853002857890516',
      last_updated_by_app_id: '119211728144504',
      name: '2_1_8_전문인재_전기전장',
      source_ad: [Object],
      source_ad_id: '23853002724100516',
      status: 'ACTIVE'
    },
    _fields: [
      'account_id',
      'ad_review_feedback',
      'adlabels',
      'adset',
      'adset_id',
      'bid_amount',
      'bid_info',
      'bid_type',
      'campaign',
      'campaign_id',
      'configured_status',
      'conversion_domain',
      'conversion_specs',
      'created_time',
      'creative',
      'demolink_hash',
      'display_sequence',
      'effective_status',
      'engagement_audience',
      'failed_delivery_checks',
      'id',
      'issues_info',
      'last_updated_by_app_id',
      'name',
      'preview_shareable_link',
      'priority',
      'recommendations',
      'source_ad',
      'source_ad_id',
      'status',
      'targeting',
      'tracking_and_conversion_with_defaults',
      'tracking_specs',
      'updated_time'
    ],
    _changes: {
      account_id: '2607869862847972',
      adset: [Object],
      adset_id: '23853001024970516',
      campaign: [Object],
      campaign_id: '23853001024860516',
      configured_status: 'ACTIVE',
      conversion_specs: [Array],
      created_time: '2023-02-24T14:51:38+0900',
      creative: [Object],
      effective_status: 'ACTIVE',
      id: '23853002857890516',
      last_updated_by_app_id: '119211728144504',
      name: '2_1_8_전문인재_전기전장',
      source_ad: [Object],
      source_ad_id: '23853002724100516',
      status: 'ACTIVE'
    },
    account_id: [Getter/Setter],
    ad_review_feedback: [Getter/Setter],
    adlabels: [Getter/Setter],
    adset: [Getter/Setter],
    adset_id: [Getter/Setter],
    bid_amount: [Getter/Setter],
    bid_info: [Getter/Setter],
    bid_type: [Getter/Setter],
    campaign: [Getter/Setter],
    campaign_id: [Getter/Setter],
    configured_status: [Getter/Setter],
    conversion_domain: [Getter/Setter],
    conversion_specs: [Getter/Setter],
    created_time: [Getter/Setter],
    creative: [Getter/Setter],
    demolink_hash: [Getter/Setter],
    display_sequence: [Getter/Setter],
    effective_status: [Getter/Setter],
    engagement_audience: [Getter/Setter],
    failed_delivery_checks: [Getter/Setter],
    id: [Getter/Setter],
    issues_info: [Getter/Setter],
    last_updated_by_app_id: [Getter/Setter],
    name: [Getter/Setter],
    preview_shareable_link: [Getter/Setter],
    priority: [Getter/Setter],
    recommendations: [Getter/Setter],
    source_ad: [Getter/Setter],
    source_ad_id: [Getter/Setter],
    status: [Getter/Setter],
    targeting: [Getter/Setter],
    tracking_and_conversion_with_defaults: [Getter/Setter],
    tracking_specs: [Getter/Setter],
    updated_time: [Getter/Setter],
    _parentId: undefined,
    _api: FacebookAdsApi {
      accessToken: 'EAARBqMoR4BsBAEorGddQafvVe7B31sQLH1aVXeuZAksGovBQ6UG7MNdFKl86lhaBFqegvtv38M5bmcUGXC4vRkekEVCkHbjUR1I5FuF7ZB8agMRtY8KkNkTwjWnZAZABMFliM0TGZAZBWRZAOOZBw92wCA7WYrLgaVfe1PZAl3k6KOxvpAkxQZAN9AzRwYJVGTX9sIhMZBcZC4slgwZDZD',
      locale: 'en_US',
      _debug: false,
      _showHeader: false
    }
  },
]
*/
