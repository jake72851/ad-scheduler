const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
const CONFDB = require('../config/db');
const db = require('../db/connect');
const dayjs = require('dayjs');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

// 계정별 캠페인 확인
exports.request = async function (userId, accountId, pageId) {
  const account = new AdAccount(accountId);
  const fields = [
    'account_id',
    'ad_strategy_group_id',
    'ad_strategy_id',
    'adlabels',
    'bid_strategy',
    'boosted_object_id',
    'brand_lift_studies',
    'budget_rebalance_flag',
    'budget_remaining',
    'buying_type',
    'can_create_brand_lift_study',
    'can_use_spend_cap',
    'configured_status',
    'created_time',
    'daily_budget',
    'effective_status',
    'has_secondary_skadnetwork_reporting',
    'id',
    'is_skadnetwork_attribution',
    'issues_info',
    'last_budget_toggling_time',
    'lifetime_budget',
    'name',
    'objective',
    'pacing_type',
    'primary_attribution',
    'promoted_object',
    'recommendations',
    'smart_promotion_type',
    'source_campaign',
    'source_campaign_id',
    'special_ad_categories',
    'special_ad_category',
    'special_ad_category_country',
    'spend_cap',
    'start_time',
    'status',
    'stop_time',
    'topline_id',
    'updated_time',
  ];
  const params = {
    effective_status: ['ACTIVE', 'PAUSED'],
    filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let campaignss = await account.getCampaigns(fields, params);
  console.log('campaignss.length =', campaignss.length);

  const campaingResult = [];
  campaignss.map((element) => campaingResult.push(element._data));
  // campaingResult.push(...campaignss._data);

  while (campaignss.hasNext()) {
    campaignss = await campaignss.next();
    campaignss.map((element) => campaingResult.push(element._data));
  }

  // const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  // const userFacebook = vad.collection('user_facebook');
  const vad = await db.connection(CONFDB.DB.NAME);
  const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);

  for (const [index, value] of campaingResult.entries()) {
    const data = {
      userId,
      apiId: 'campaigns',
      dataType: 'info',
      campaignNum: index,
      campaignInfo: value,
      createdDay: dayjs().format('YYYY-MM-DD'),
      createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
    };
    await userFacebook.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        campaignNum: data.campaignNum,
        createdDay: data.createdDay,
      },
      { $set: data },
      { upsert: true }
    );
  }

  return campaingResult;
};

// console.log('campaignss =', campaignss)
/* 여러개 있을수 있음
campaignss = [
  Campaign {
    _data: {
      account_id: '2607869862847972',
      budget_rebalance_flag: false,
      budget_remaining: '0',
      buying_type: 'AUCTION',
      can_create_brand_lift_study: false,
      can_use_spend_cap: true,
      configured_status: 'ACTIVE',
      created_time: '2023-02-24T14:51:37+0900',
      effective_status: 'ACTIVE',
      has_secondary_skadnetwork_reporting: false,
      id: '23853001024860516',
      is_skadnetwork_attribution: false,
      name: '2_반디불_잠재고객수집',
      objective: 'OUTCOME_LEADS',
      primary_attribution: 'DEFAULT',
      smart_promotion_type: 'GUIDED_CREATION',
      source_campaign_id: '0',
      special_ad_categories: [],
      special_ad_category: 'NONE',
      start_time: '2023-02-24T14:51:37+0900',
      status: 'ACTIVE',
      topline_id: '0',
      updated_time: '2023-02-24T14:51:37+0900'
    },
    _fields: [
      'account_id',
      'ad_strategy_group_id',
      'ad_strategy_id',
      'adlabels',
      'bid_strategy',
      'boosted_object_id',
      'brand_lift_studies',
      'budget_rebalance_flag',
      'budget_remaining',
      'buying_type',
      'can_create_brand_lift_study',
      'can_use_spend_cap',
      'configured_status',
      'created_time',
      'daily_budget',
      'effective_status',
      'has_secondary_skadnetwork_reporting',
      'id',
      'is_skadnetwork_attribution',
      'issues_info',
      'last_budget_toggling_time',
      'lifetime_budget',
      'name',
      'objective',
      'pacing_type',
      'primary_attribution',
      'promoted_object',
      'recommendations',
      'smart_promotion_type',
      'source_campaign',
      'source_campaign_id',
      'special_ad_categories',
      'special_ad_category',
      'special_ad_category_country',
      'spend_cap',
      'start_time',
      'status',
      'stop_time',
      'topline_id',
      'updated_time'
    ],
    _changes: {
      account_id: '2607869862847972',
      budget_rebalance_flag: false,
      budget_remaining: '0',
      buying_type: 'AUCTION',
      can_create_brand_lift_study: false,
      can_use_spend_cap: true,
      configured_status: 'ACTIVE',
      created_time: '2023-02-24T14:51:37+0900',
      effective_status: 'ACTIVE',
      has_secondary_skadnetwork_reporting: false,
      id: '23853001024860516',
      is_skadnetwork_attribution: false,
      name: '2_반디불_잠재고객수집',
      objective: 'OUTCOME_LEADS',
      primary_attribution: 'DEFAULT',
      smart_promotion_type: 'GUIDED_CREATION',
      source_campaign_id: '0',
      special_ad_categories: [],
      special_ad_category: 'NONE',
      start_time: '2023-02-24T14:51:37+0900',
      status: 'ACTIVE',
      topline_id: '0',
      updated_time: '2023-02-24T14:51:37+0900'
    },
    account_id: [Getter/Setter],
    ad_strategy_group_id: [Getter/Setter],
    ad_strategy_id: [Getter/Setter],
    adlabels: [Getter/Setter],
    bid_strategy: [Getter/Setter],
    boosted_object_id: [Getter/Setter],
    brand_lift_studies: [Getter/Setter],
    budget_rebalance_flag: [Getter/Setter],
    budget_remaining: [Getter/Setter],
    buying_type: [Getter/Setter],
    can_create_brand_lift_study: [Getter/Setter],
    can_use_spend_cap: [Getter/Setter],
    configured_status: [Getter/Setter],
    created_time: [Getter/Setter],
    daily_budget: [Getter/Setter],
    effective_status: [Getter/Setter],
    has_secondary_skadnetwork_reporting: [Getter/Setter],
    id: [Getter/Setter],
    is_skadnetwork_attribution: [Getter/Setter],
    issues_info: [Getter/Setter],
    last_budget_toggling_time: [Getter/Setter],
    lifetime_budget: [Getter/Setter],
    name: [Getter/Setter],
    objective: [Getter/Setter],
    pacing_type: [Getter/Setter],
    primary_attribution: [Getter/Setter],
    promoted_object: [Getter/Setter],
    recommendations: [Getter/Setter],
    smart_promotion_type: [Getter/Setter],
    source_campaign: [Getter/Setter],
    source_campaign_id: [Getter/Setter],
    special_ad_categories: [Getter/Setter],
    special_ad_category: [Getter/Setter],
    special_ad_category_country: [Getter/Setter],
    spend_cap: [Getter/Setter],
    start_time: [Getter/Setter],
    status: [Getter/Setter],
    stop_time: [Getter/Setter],
    topline_id: [Getter/Setter],
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
