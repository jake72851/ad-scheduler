const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');
// const dayjs = require('dayjs');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.reqBreakdown = async function (userId, accountId, termDay, breakdown, actionBreakdown) {
  const account = new AdAccount(accountId);
  const fieldsAcc = [
    'id',
    'name',
    'attribution_spec', // 기여 설정 (결과 지표 관련) > 정보 안나옴
    // 'promoted_object', // 광고 게재 최적화 기준 (결과 지표 관련)
  ];
  const paramsAcc = {
    time_range: { since: termDay, until: termDay },
    // filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  const accountInfos = await account.read(fieldsAcc, paramsAcc);
  // console.log('accountInfos =', accountInfos);
  /*
  _fields: [
    'account_id',
    'account_status',
    'ad_account_promotable_objects',
    'age',
    'agency_client_declaration',
    'amount_spent',
    'attribution_spec',
    'balance',
    'business',
    'business_city',
    'business_country_code',
    'business_name',
    'business_state',
    'business_street',
    'business_street2',
    'business_zip',
    'can_create_brand_lift_study',
    'capabilities',
    'created_time',
    'currency',
    'custom_audience_info',
    'disable_reason',
    'end_advertiser',
    'end_advertiser_name',
    'existing_customers',
    'extended_credit_invoice_group',
    'failed_delivery_checks',
    'fb_entity',
    'funding_source',
    'funding_source_details',
    'has_advertiser_opted_in_odax',
    'has_migrated_permissions',
    'has_page_authorized_adaccount',
    'id',
    'io_number',
    'is_attribution_spec_system_default',
    'is_direct_deals_enabled',
    'is_in_3ds_authorization_enabled_market',
    'is_notifications_enabled',
    'is_personal',
    'is_prepay_account',
    'is_tax_id_required',
    'liable_address',
    'line_numbers',
    'media_agency',
    'min_campaign_group_spend_cap',
    'min_daily_budget',
    'name',
    'offsite_pixels_tos_accepted',
    'owner',
    'owner_business',
    'partner',
    'rf_spec',
    'send_bill_to_address',
    'show_checkout_experience',
    'sold_to_address',
    'spend_cap',
    'tax_id',
    'tax_id_status',
    'tax_id_type',
    'timezone_id',
    'timezone_name',
    'timezone_offset_hours_utc',
    'tos_accepted',
    'user_tasks',
    'user_tos_accepted',
    'viewable_business'
  ],
  */
  // console.log('accountInfos._data =', accountInfos._data);
  // accountInfos._data = { id: 'act_309301737341584', name: '309301737341584' }

  /*
  const fields = [
    'account_id',
    'account_name',
    'action_values',
    'actions',

    'attribution_setting', // 정보 안나옴

    'campaign_id', // 정보 안나옴

    'conversion_values', // 정보 안나옴
    'conversions', // 정보 안나옴
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
  const fields = CONF.FACEBOOK.FIELDS;
  console.log('adAccounts fields =', fields);

  const params = {
    level: 'account',
    time_range: { since: termDay, until: termDay },
  };

  if (actionBreakdown) {
    params.actionBreakdowns = actionBreakdown;
  }
  if (breakdown) {
    params.breakdowns = breakdown;
  }
  console.log('insights breakdowns =', breakdown);
  console.log('insights action_breakdowns =', actionBreakdown);

  let insights = await account.getInsights(fields, params);
  // console.log('insights adAccounts.length =', insights.length);
  // console.log('insights adAccounts insights =', insights);
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

  const result = [];
  insights.map((element) => result.push(element._data));

  while (insights.hasNext()) {
    insights = await insights.next();
    insights.map((element) => result.push(element._data));
  }
  // console.log('insights adAccounts result =', result);

  if (result.length > 0) {
    // const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
    // const userFacebook = vad.collection('user_' + userId + '_facebook_insight');
    const vad = await db.connection(CONFDB.DB.NAME);
    const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);

    const data = {
      userId,
      apiId: 'adAccounts',
      dataType: 'insight',
      adAccountId: accountId,
      adAccountName: accountInfos._data.name,
      breakdowns: params.breakdowns,
      actionBreakdowns: params.actionBreakdowns,
      data: result,
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
        breakdowns: data.breakdowns,
        actionBreakdowns: data.actionBreakdowns,
        createdDay: data.createdDay,
      },
      { $set: data },
      { upsert: true }
    );
  }
};
