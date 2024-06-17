const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');
const dayjs = require('dayjs');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const Campaign = adsSdk.Campaign;
// const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

// 계정별 adset 확인
exports.request = async function (userId, accountId, campaignId, pageId) {
  const fields = [
    'account_id',
    'adlabels',
    'bid_amount',
    'billing_event',
    'campaign',
    'campaign_id',
    'created_time',
    'daily_budget',
    'daily_spend_cap',
    'end_time',
    'id',
    'instagram_actor_id',
    'lifetime_budget',
    'lifetime_imps',
    'lifetime_min_spend_target',
    'lifetime_spend_cap',
    'name',
    'optimization_goal',
    'optimization_sub_event',
    'pacing_type',
    'promoted_object',
    'recommendations',
    'review_feedback',
    'source_adset',
    'source_adset_id',
    'start_time',
    'status',
    'targeting',
    'targeting_optimization_types',
    'time_based_ad_rotation_id_blocks',
    'time_based_ad_rotation_intervals',
    'updated_time',
    'use_new_app_click',
  ];
  const params = {
    filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let adSets = await new Campaign(campaignId).getAdSets(fields, params);

  const adSetResult = [];
  adSets.map((element) => adSetResult.push(element._data));

  while (adSets.hasNext()) {
    adSets = await adSets.next();
    adSets.map((element) => adSetResult.push(element._data));
  }

  // const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  // const userFacebook = vad.collection('user_' + userId + '_facebook');
  const vad = await db.connection(CONFDB.DB.NAME);
  const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);

  for (const [index, value] of adSetResult.entries()) {
    const data = {
      userId,
      apiId: 'adSets',
      dataType: 'info',
      campaignId,
      adsetNum: index,
      adsetInfo: value,
      createdDay: dayjs().format('YYYY-MM-DD'),
      createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
    };
    await userFacebook.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        campaignId: data.campaignId,
        adsetNum: data.adsetNum,
        createdDay: data.createdDay,
      },
      { $set: data },
      { upsert: true }
    );
  }
};

// console.log('adSets =', adSets);
/* 여러개 있을수 있음
adSets = [
  AdSet {
    _data: {
      account_id: '2607869862847972',
      billing_event: 'IMPRESSIONS',
      campaign: [Object],
      campaign_id: '23849120717180516',
      created_time: '2021-12-21T10:30:43+0900',
      id: '23849120717210516',
      lifetime_imps: 0,
      name: '밀키파인트_20211220_test01',
      optimization_goal: 'LINK_CLICKS',
      optimization_sub_event: 'NONE',
      source_adset_id: '0',
      start_time: '2021-12-21T10:30:43+0900',
      status: 'ACTIVE',
      targeting: [Object],
      targeting_optimization_types: [Array],
      updated_time: '2021-12-21T10:30:43+0900',
      use_new_app_click: false
    },
    _fields: [
      'account_id',
      'adlabels',
      'adset_schedule',
      'asset_feed_id',
      'attribution_spec',
      'bid_adjustments',
      'bid_amount',
      'bid_constraints',
      'bid_info',
      'bid_strategy',
      'billing_event',
      'budget_remaining',
      'campaign',
      'campaign_attribution',
      'campaign_id',
      'configured_status',
      'created_time',
      'creative_sequence',
      'daily_budget',
      'daily_min_spend_target',
      'daily_spend_cap',
      'destination_type',
      'effective_status',
      'end_time',
      'existing_customer_budget_percentage',
      'frequency_control_specs',
      'full_funnel_exploration_mode',
      'id',
      'instagram_actor_id',
      'is_dynamic_creative',
      'issues_info',
      'learning_stage_info',
      'lifetime_budget',
      'lifetime_imps',
      'lifetime_min_spend_target',
      'lifetime_spend_cap',
      'multi_optimization_goal_weight',
      'name',
      'optimization_goal',
      'optimization_sub_event',
      'pacing_type',
      'promoted_object',
      'recommendations',
      'recurring_budget_semantics',
      'review_feedback',
      'rf_prediction_id',
      'source_adset',
      'source_adset_id',
      'start_time',
      'status',
      'targeting',
      'targeting_optimization_types',
      'time_based_ad_rotation_id_blocks',
      'time_based_ad_rotation_intervals',
      'updated_time',
      'use_new_app_click'
    ],
    _changes: {
      account_id: '2607869862847972',
      billing_event: 'IMPRESSIONS',
      campaign: [Object],
      campaign_id: '23849120717180516',
      created_time: '2021-12-21T10:30:43+0900',
      id: '23849120717210516',
      lifetime_imps: 0,
      name: '밀키파인트_20211220_test01',
      optimization_goal: 'LINK_CLICKS',
      optimization_sub_event: 'NONE',
      source_adset_id: '0',
      start_time: '2021-12-21T10:30:43+0900',
      status: 'ACTIVE',
      targeting: [Object],
      targeting_optimization_types: [Array],
      updated_time: '2021-12-21T10:30:43+0900',
      use_new_app_click: false
    },
    account_id: [Getter/Setter],
    adlabels: [Getter/Setter],
    adset_schedule: [Getter/Setter],
    asset_feed_id: [Getter/Setter],
    attribution_spec: [Getter/Setter],
    bid_adjustments: [Getter/Setter],
    bid_amount: [Getter/Setter],
    bid_constraints: [Getter/Setter],
    bid_info: [Getter/Setter],
    bid_strategy: [Getter/Setter],
    billing_event: [Getter/Setter],
    budget_remaining: [Getter/Setter],
    campaign: [Getter/Setter],
    campaign_attribution: [Getter/Setter],
    campaign_id: [Getter/Setter],
    configured_status: [Getter/Setter],
    created_time: [Getter/Setter],
    creative_sequence: [Getter/Setter],
    daily_budget: [Getter/Setter],
    daily_min_spend_target: [Getter/Setter],
    daily_spend_cap: [Getter/Setter],
    destination_type: [Getter/Setter],
    effective_status: [Getter/Setter],
    end_time: [Getter/Setter],
    existing_customer_budget_percentage: [Getter/Setter],
    frequency_control_specs: [Getter/Setter],
    full_funnel_exploration_mode: [Getter/Setter],
    id: [Getter/Setter],
    instagram_actor_id: [Getter/Setter],
    is_dynamic_creative: [Getter/Setter],
    issues_info: [Getter/Setter],
    learning_stage_info: [Getter/Setter],
    lifetime_budget: [Getter/Setter],
    lifetime_imps: [Getter/Setter],
    lifetime_min_spend_target: [Getter/Setter],
    lifetime_spend_cap: [Getter/Setter],
    multi_optimization_goal_weight: [Getter/Setter],
    name: [Getter/Setter],
    optimization_goal: [Getter/Setter],
    optimization_sub_event: [Getter/Setter],
    pacing_type: [Getter/Setter],
    promoted_object: [Getter/Setter],
    recommendations: [Getter/Setter],
    recurring_budget_semantics: [Getter/Setter],
    review_feedback: [Getter/Setter],
    rf_prediction_id: [Getter/Setter],
    source_adset: [Getter/Setter],
    source_adset_id: [Getter/Setter],
    start_time: [Getter/Setter],
    status: [Getter/Setter],
    targeting: [Getter/Setter],
    targeting_optimization_types: [Getter/Setter],
    time_based_ad_rotation_id_blocks: [Getter/Setter],
    time_based_ad_rotation_intervals: [Getter/Setter],
    updated_time: [Getter/Setter],
    use_new_app_click: [Getter/Setter],
    _parentId: undefined,
    _api: FacebookAdsApi {
      accessToken: 'EAARBqMoR4BsBAEorGddQafvVe7B31sQLH1aVXeuZAksGovBQ6UG7MNdFKl86lhaBFqegvtv38M5bmcUGXC4vRkekEVCkHbjUR1I5FuF7ZB8agMRtY8KkNkTwjWnZAZABMFliM0TGZAZBWRZAOOZBw92wCA7WYrLgaVfe1PZAl3k6KOxvpAkxQZAN9AzRwYJVGTX9sIhMZBcZC4slgwZDZD',
      locale: 'en_US',
      _debug: false,
      _showHeader: false
    }
  },
  _api: FacebookAdsApi {
    accessToken: 'EAARBqMoR4BsBAEorGddQafvVe7B31sQLH1aVXeuZAksGovBQ6UG7MNdFKl86lhaBFqegvtv38M5bmcUGXC4vRkekEVCkHbjUR1I5FuF7ZB8agMRtY8KkNkTwjWnZAZABMFliM0TGZAZBWRZAOOZBw92wCA7WYrLgaVfe1PZAl3k6KOxvpAkxQZAN9AzRwYJVGTX9sIhMZBcZC4slgwZDZD',
    locale: 'en_US',
    _debug: false,
    _showHeader: false
  },
  _targetClass: [Function: AdSet],
  paging: {
    cursors: {
      before: 'QVFIUjY0Wk54VTVBTjdLa2xhN0VPeWl4U0NvN2pUOGVQbHZA1Q1J0SlJaSDlxNzEwNHZAJaWtYVG41X3lpVXdCT21GU1R1dE9abDVrSktldlpUVDVCcGVEWkJ3',
      after: 'QVFIUjY0Wk54VTVBTjdLa2xhN0VPeWl4U0NvN2pUOGVQbHZA1Q1J0SlJaSDlxNzEwNHZAJaWtYVG41X3lpVXdCT21GU1R1dE9abDVrSktldlpUVDVCcGVEWkJ3'
    }
  },
  clear: [Function (anonymous)],
  set: [Function (anonymous)],
  next: [Function (anonymous)],
  hasNext: [Function (anonymous)],
  previous: [Function (anonymous)],
  hasPrevious: [Function (anonymous)],
  _loadPage: [Function (anonymous)],
  _buildObjectsFromResponse: [Function (anonymous)],
  summary: undefined
]
*/
