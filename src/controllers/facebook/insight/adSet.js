const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');
// const dayjs = require('dayjs');
// const axios = require('../../../util/axios');
const resultMapping = require('../../../util/facebookResultMapping');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const AdSet = adsSdk.AdSet;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.reqBreakdown = async function (userId, accountId, termDay, breakdown, actionBreakdown) {
  const account = new AdAccount(accountId);
  const fieldsAcc = [
    'id',
    'name',
    'campaign_id',
    // 'billing_event',
    // 'bid_amount',
    // 'campaign_attribution',
    'attribution_spec', // 결과지표관련 기여설정정보 (ex: "7일간의 클릭수 또는 1일간의 조회수") > 이 정보를 통해서 1차적으로 action의 value를 맞게 구할 수 있음
    'promoted_object', // 광고 게재 최적화 기준 (결과 지표 관련) > 데이터가 없는 경우 있음
  ];
  const paramsAcc = {
    time_range: { since: termDay, until: termDay },
    // time_range: { since: '2022-07-01', until: '2023-05-26' },
    // filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let adSetsInfos = await account.getAdSets(fieldsAcc, paramsAcc);
  // console.log('adSetsInfos =', adSetsInfos);
  /*
    {
      id: '23854030854620343',
      name: '6_1',
      campaign_id: '23854030853950343',
      campaign_attribution: 'DEFAULT',
      attribution_spec: [Array],
      promoted_object: [Object]
    },
  */
  /*
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
  */

  const resultIds = [];
  adSetsInfos.map((element) => resultIds.push(element._data));
  while (adSetsInfos.hasNext()) {
    adSetsInfos = await adSetsInfos.next();
    adSetsInfos.map((element) => resultIds.push(element._data));
  }
  // console.log('adSetsInfos id 정보 =', resultIds);
  /*
    // custom_event_type 이 있어야 결과지표 확인가능
    "promoted_object": {
        "pixel_id": "405217380297045",
        "custom_event_type": "PURCHASE"
    },
    "attribution_spec": [
    {
      "event_type": "CLICK_THROUGH",
      "window_days": 1
    },
    {
      "event_type": "VIEW_THROUGH",
      "window_days": 1
    }
  ]

    [
      {
        id: '23854276895120456',
        name: '11_1_논타겟',
        campaign_id: '23854276894500456',
        attribution_spec: [ [Object] ],
        promoted_object: {
          application_id: '1641778399354509',
          object_store_url: 'http://itunes.apple.com/app/id1587115205'
        }
      },
    ]
  */
  console.log('adSetsInfos.length =', resultIds.length);

  for (const [index, value] of resultIds.entries()) {
    console.log(' ');
    console.log(index);
    console.log('adset id =', value.id);
    console.log('adset name =', value.name);
    console.log('adset attribution_spec =', value.attribution_spec);
    /*
    adset attribution_spec = [
      { event_type: 'CLICK_THROUGH', window_days: 7 },
      { event_type: 'VIEW_THROUGH', window_days: 1 }
    ]
    */

    const actionAttributionWindows = [];
    if (value.attribution_spec) {
      for (const specItem of value.attribution_spec) {
        if (specItem.event_type === 'CLICK_THROUGH') {
          actionAttributionWindows.push(specItem.window_days + 'd_click');
        }
        if (specItem.event_type === 'VIEW_THROUGH') {
          actionAttributionWindows.push(specItem.window_days + 'd_view');
        }
      }
    } else {
      actionAttributionWindows.push('1d_view');
      console.log('adset actionAttributionWindows 없음');
    }
    console.log('adset actionAttributionWindows =', actionAttributionWindows);

    const adSet = new AdSet(value.id);
    /*
    const fieldsInsight = [
      'account_id',
      'account_name',
      'action_values',
      'actions',

      // adset용 지표
      'ad_id',
      'ad_name',
      'adset_id',
      'adset_name',
      // 'attribution_setting', // 정보 안나옴

      'campaign_id',

      'conversion_values',
      'conversions',
      'clicks',
      'cost_per_action_type',
      'cost_per_conversion',
      'cost_per_outbound_click',
      'cpc',
      'cpm',
      'ctr',
      'frequency',
      'impressions',
      'objective',
      'optimization_goal',
      'outbound_clicks',
      'outbound_clicks_ctr',
      'reach',
      'spend',
      'unique_outbound_clicks',
      'unique_outbound_clicks_ctr',
      'video_p100_watched_actions',
      'video_p25_watched_actions',
      'video_p50_watched_actions',
      'video_p75_watched_actions',
      // 'video_play_actions',
      // 'purchase_roas',
    ];
    */
    const fieldsInsight = CONF.FACEBOOK.FIELDS;
    const paramsInsight = {
      // level: 'adset',
      time_range: { since: termDay, until: termDay },
      // time_range: { since: '2022-07-01', until: '2023-05-26' },
      // action_attribution_windows: '7d_click,1d_view',
      action_attribution_windows: actionAttributionWindows,
    };

    if (actionBreakdown) {
      paramsInsight.actionBreakdowns = actionBreakdown;
    }
    if (breakdown) {
      paramsInsight.breakdowns = breakdown;
    }

    let insights = await adSet.getInsights(fieldsInsight, paramsInsight);
    console.log('insights breakdowns =', breakdown);
    console.log('insights action_breakdowns =', actionBreakdown);

    const result = [];
    insights.map((element) => result.push(element._data));

    while (insights.hasNext()) {
      insights = await insights.next();
      insights.map((element) => result.push(element._data));
    }
    // console.log('insights adSet insights =', result);
    // console.log('insights adSet insights.length =', result.length);

    if (result.length > 0) {
      // 결과 관련 정보 확인
      for (const item of result) {
        const resultValue = await resultMapping.request(
          value.attribution_spec,
          value.promoted_object,
          item.actions,
          item.objective,
          item.optimization_goal,
          item.conversions,
          item.conversion_values,
          actionAttributionWindows
        );
        item.result = resultValue;
        // result 지표 참고용 지표 저장해봄
        item.attribution_spec = value.attribution_spec;
        item.promoted_object = value.promoted_object;
        item.actionAttributionWindows = actionAttributionWindows;
      }

      const vad = await db.connection(CONFDB.DB.NAME);
      const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);

      const data = {
        userId,
        apiId: 'adSets',
        dataType: 'insight',
        adAccountId: accountId,
        campaignId: value.campaign_id,
        adSetId: value.id,
        adSetName: value.name,
        breakdowns: paramsInsight.breakdowns,
        actionBreakdowns: paramsInsight.actionBreakdowns,
        data: result,
        // createdDay: dayjs().format('YYYY-MM-DD'),
        // createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
        createdDay: termDay,
        createdAt: new Date(termDay + 'T00:00:00Z'),
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      await userFacebook.updateOne(
        {
          userId: data.userId,
          apiId: data.apiId,
          dataType: data.dataType,
          adAccountId: data.adAccountId,
          campaignId: data.campaignId,
          adSetId: data.adSetId,
          breakdowns: data.breakdowns,
          actionBreakdowns: data.actionBreakdowns,
          createdDay: data.createdDay,
        },
        { $set: data },
        { upsert: true }
      );
    }
  }
};

// console.log('insights adSet =', insights);
/*
  account_currency: [Getter/Setter],
  account_id: [Getter/Setter],
  account_name: [Getter/Setter],
  action_values: [Getter/Setter],
  actions: [Getter/Setter],
  ad_bid_value: [Getter/Setter],
  ad_click_actions: [Getter/Setter],
  ad_id: [Getter/Setter],
  ad_impression_actions: [Getter/Setter],
  ad_name: [Getter/Setter],
  adset_bid_value: [Getter/Setter],
  adset_end: [Getter/Setter],
  adset_id: [Getter/Setter],
  adset_name: [Getter/Setter],
  adset_start: [Getter/Setter],
  age_targeting: [Getter/Setter],
  attribution_setting: [Getter/Setter],
  auction_bid: [Getter/Setter],
  auction_competitiveness: [Getter/Setter],
  auction_max_competitor_bid: [Getter/Setter],
  buying_type: [Getter/Setter],
  campaign_id: [Getter/Setter],
  campaign_name: [Getter/Setter],
  canvas_avg_view_percent: [Getter/Setter],
  canvas_avg_view_time: [Getter/Setter],
  catalog_segment_actions: [Getter/Setter],
  catalog_segment_value: [Getter/Setter],
  catalog_segment_value_mobile_purchase_roas: [Getter/Setter],
  catalog_segment_value_omni_purchase_roas: [Getter/Setter],
  catalog_segment_value_website_purchase_roas: [Getter/Setter],
  clicks: [Getter/Setter],
  conversion_rate_ranking: [Getter/Setter],
  conversion_values: [Getter/Setter],
  conversions: [Getter/Setter],
  converted_product_quantity: [Getter/Setter],
  converted_product_value: [Getter/Setter],
  cost_per_15_sec_video_view: [Getter/Setter],
  cost_per_2_sec_continuous_video_view: [Getter/Setter],
  cost_per_action_type: [Getter/Setter],
  cost_per_ad_click: [Getter/Setter],
  cost_per_conversion: [Getter/Setter],
  cost_per_dda_countby_convs: [Getter/Setter],
  cost_per_estimated_ad_recallers: [Getter/Setter],
  cost_per_inline_link_click: [Getter/Setter],
  cost_per_inline_post_engagement: [Getter/Setter],
  cost_per_one_thousand_ad_impression: [Getter/Setter],
  cost_per_outbound_click: [Getter/Setter],
  cost_per_thruplay: [Getter/Setter],
  cost_per_unique_action_type: [Getter/Setter],
  cost_per_unique_click: [Getter/Setter],
  cost_per_unique_conversion: [Getter/Setter],
  cost_per_unique_inline_link_click: [Getter/Setter],
  cost_per_unique_outbound_click: [Getter/Setter],
  cpc: [Getter/Setter],
  cpm: [Getter/Setter],
  cpp: [Getter/Setter],
  created_time: [Getter/Setter],
  ctr: [Getter/Setter],
  date_start: [Getter/Setter],
  date_stop: [Getter/Setter],
  dda_countby_convs: [Getter/Setter],
  dda_results: [Getter/Setter],
  engagement_rate_ranking: [Getter/Setter],
  estimated_ad_recall_rate: [Getter/Setter],
  estimated_ad_recall_rate_lower_bound: [Getter/Setter],
  estimated_ad_recall_rate_upper_bound: [Getter/Setter],
  estimated_ad_recallers: [Getter/Setter],
  estimated_ad_recallers_lower_bound: [Getter/Setter],
  estimated_ad_recallers_upper_bound: [Getter/Setter],
  frequency: [Getter/Setter],
  full_view_impressions: [Getter/Setter],
  full_view_reach: [Getter/Setter],
  gender_targeting: [Getter/Setter],
  impressions: [Getter/Setter],
  inline_link_click_ctr: [Getter/Setter],
  inline_link_clicks: [Getter/Setter],
  inline_post_engagement: [Getter/Setter],
  instant_experience_clicks_to_open: [Getter/Setter],
  instant_experience_clicks_to_start: [Getter/Setter],
  instant_experience_outbound_clicks: [Getter/Setter],
  interactive_component_tap: [Getter/Setter],
  labels: [Getter/Setter],
  location: [Getter/Setter],
  mobile_app_purchase_roas: [Getter/Setter],
  objective: [Getter/Setter],
  optimization_goal: [Getter/Setter],
  outbound_clicks: [Getter/Setter],
  outbound_clicks_ctr: [Getter/Setter],
  place_page_name: [Getter/Setter],
  purchase_roas: [Getter/Setter],
  qualifying_question_qualify_answer_rate: [Getter/Setter],
  quality_ranking: [Getter/Setter],
  quality_score_ectr: [Getter/Setter],
  quality_score_ecvr: [Getter/Setter],
  quality_score_organic: [Getter/Setter],
  reach: [Getter/Setter],
  social_spend: [Getter/Setter],
  spend: [Getter/Setter],
  total_postbacks: [Getter/Setter],
  total_postbacks_detailed: [Getter/Setter],
  unique_actions: [Getter/Setter],
  unique_clicks: [Getter/Setter],
  unique_conversions: [Getter/Setter],
  unique_ctr: [Getter/Setter],
  unique_inline_link_click_ctr: [Getter/Setter],
  unique_inline_link_clicks: [Getter/Setter],
  unique_link_clicks_ctr: [Getter/Setter],
  unique_outbound_clicks: [Getter/Setter],
  unique_outbound_clicks_ctr: [Getter/Setter],
  unique_video_continuous_2_sec_watched_actions: [Getter/Setter],
  unique_video_view_15_sec: [Getter/Setter],
  updated_time: [Getter/Setter],
  video_15_sec_watched_actions: [Getter/Setter],
  video_30_sec_watched_actions: [Getter/Setter],
  video_avg_time_watched_actions: [Getter/Setter],
  video_continuous_2_sec_watched_actions: [Getter/Setter],
  video_p100_watched_actions: [Getter/Setter],
  video_p25_watched_actions: [Getter/Setter],
  video_p50_watched_actions: [Getter/Setter],
  video_p75_watched_actions: [Getter/Setter],
  video_p95_watched_actions: [Getter/Setter],
  video_play_actions: [Getter/Setter],
  video_play_curve_actions: [Getter/Setter],
  video_play_retention_0_to_15s_actions: [Getter/Setter],
  video_play_retention_20_to_60s_actions: [Getter/Setter],
  video_play_retention_graph_actions: [Getter/Setter],
  video_thruplay_watched_actions: [Getter/Setter],
  video_time_watched_actions: [Getter/Setter],
  website_ctr: [Getter/Setter],
  website_purchase_roas: [Getter/Setter],
  wish_bid: [Getter/Setter],
*/
