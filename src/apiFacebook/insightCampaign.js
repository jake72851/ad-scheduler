const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const CampaignInsight = require('../controllers/facebook/insight/campaign');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
// const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (userId, accountId, pageId, termDay) {
  // breakdown이 지정되지 않은 기본
  await CampaignInsight.reqBreakdown(userId, accountId, pageId, termDay, '', '');

  // 기본 breakdown 조최
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN.length; i++) {
    // 오류가 발생하는 breakdown는 제외
    if (CONF.FACEBOOK.BREAKDOWN[i] !== 'image_asset, video_asset') {
      await CampaignInsight.reqBreakdown(userId, accountId, pageId, termDay, CONF.FACEBOOK.BREAKDOWN[i], '');
    }
  }

  // 기본 action breakdown 조최
  for (let i = 0; i < CONF.FACEBOOK.ACTION_BREAKDOWN.length; i++) {
    // 오류가 발생하는 action breakdown는 제외
    if (CONF.FACEBOOK.ACTION_BREAKDOWN[i] !== 'action_carousel_card_id, action_carousel_card_name, action_type') {
      await CampaignInsight.reqBreakdown(userId, accountId, pageId, termDay, '', CONF.FACEBOOK.ACTION_BREAKDOWN[i]);
    }
  }

  // 캠페인은 다이내믹 크리에이트브 요소별 breakdown이 없음
  // for (let i = 0; i < CONF.FACEBOOK.DYNAMIC_BREAKDOWN.length; i++) {
  //   await FacebookAccountInsight.reqBreakdown(userId, accountId, termDay, CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i], '');
  // }

  // 조합 BREAKDOWN_AND_ACTION_BREAKDOWN 조회
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN.length; i++) {
    if (CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].break !== 'image_asset, video_asset') {
      if (
        CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].action !==
        'action_carousel_card_id, action_carousel_card_name, action_type'
      ) {
        await CampaignInsight.reqBreakdown(
          userId,
          accountId,
          pageId,
          termDay,
          CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].break,
          CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].action
        );
      }
    }
  }

  // 캠페인은 조합 BREAKDOWN_AND_DYNAMIC_BREAKDOWN 이 없음
  // for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN.length; i++) {
  //   await FacebookAccountInsight.reqBreakdown(
  //     userId,
  //     accountId,
  //     termDay,
  //     CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN[i].break + ', ' + CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN[i].dynamic,
  //     ''
  //   );
  // }
};

/*
insights = [
  AdsInsights {
    _data: {
      ctr: '2.132623',
      cpc: '0.341161',
      clicks: '3145',
      outbound_clicks: [Array],
      outbound_clicks_ctr: [Array],
      cost_per_outbound_click: [Array],
      spend: '1072.95',
      account_id: '2607869862847972',
      objective: 'MULTIPLE',
      cpm: '7.275668',
      impressions: '147471',
      reach: '60689',
      frequency: '2.429946',
      video_p75_watched_actions: [Array],
      video_p50_watched_actions: [Array],
      video_p25_watched_actions: [Array],
      video_p100_watched_actions: [Array],
      video_play_actions: [Array],
      date_start: '2023-01-29',
      date_stop: '2023-02-27'
    },
    _fields: [
      'account_currency',
      'account_id',
      'account_name',
      'action_values',
      'actions',
      'ad_bid_value',
      'ad_click_actions',
      'ad_id',
      'ad_impression_actions',
      'ad_name',
      'adset_bid_value',
      'adset_end',
      'adset_id',
      'adset_name',
      'adset_start',
      'age_targeting',
      'attribution_setting',
      'auction_bid',
      'auction_competitiveness',
      'auction_max_competitor_bid',
      'buying_type',
      'campaign_id',
      'campaign_name',
      'canvas_avg_view_percent',
      'canvas_avg_view_time',
      'catalog_segment_actions',
      'catalog_segment_value',
      'catalog_segment_value_mobile_purchase_roas',
      'catalog_segment_value_omni_purchase_roas',
      'catalog_segment_value_website_purchase_roas',
      'clicks',
      'conversion_rate_ranking',
      'conversion_values',
      'conversions',
      'converted_product_quantity',
      'converted_product_value',
      'cost_per_15_sec_video_view',
      'cost_per_2_sec_continuous_video_view',
      'cost_per_action_type',
      'cost_per_ad_click',
      'cost_per_conversion',
      'cost_per_dda_countby_convs',
      'cost_per_estimated_ad_recallers',
      'cost_per_inline_link_click',
      'cost_per_inline_post_engagement',
      'cost_per_one_thousand_ad_impression',
      'cost_per_outbound_click',
      'cost_per_thruplay',
      'cost_per_unique_action_type',
      'cost_per_unique_click',
      'cost_per_unique_conversion',
      'cost_per_unique_inline_link_click',
      'cost_per_unique_outbound_click',
      'cpc',
      'cpm',
      'cpp',
      'created_time',
      'ctr',
      'date_start',
      'date_stop',
      'dda_countby_convs',
      'dda_results',
      'engagement_rate_ranking',
      'estimated_ad_recall_rate',
      'estimated_ad_recall_rate_lower_bound',
      'estimated_ad_recall_rate_upper_bound',
      'estimated_ad_recallers',
      'estimated_ad_recallers_lower_bound',
      'estimated_ad_recallers_upper_bound',
      'frequency',
      'full_view_impressions',
      'full_view_reach',
      'gender_targeting',
      'impressions',
      'inline_link_click_ctr',
      'inline_link_clicks',
      'inline_post_engagement',
      'instant_experience_clicks_to_open',
      'instant_experience_clicks_to_start',
      'instant_experience_outbound_clicks',
      'interactive_component_tap',
      'labels',
      'location',
      'mobile_app_purchase_roas',
      'objective',
      'optimization_goal',
      'outbound_clicks',
      'outbound_clicks_ctr',
      'place_page_name',
      'purchase_roas',
      'qualifying_question_qualify_answer_rate',
      'quality_ranking',
      'quality_score_ectr',
      'quality_score_ecvr',
      'quality_score_organic',
      'reach',
      'social_spend',
      'spend',
      'total_postbacks',
      'total_postbacks_detailed',
      ... 31 more items
    ],
    _changes: {
      ctr: '2.132623',
      cpc: '0.341161',
      clicks: '3145',
      outbound_clicks: [Array],
      outbound_clicks_ctr: [Array],
      cost_per_outbound_click: [Array],
      spend: '1072.95',
      account_id: '2607869862847972',
      objective: 'MULTIPLE',
      cpm: '7.275668',
      impressions: '147471',
      reach: '60689',
      frequency: '2.429946',
      video_p75_watched_actions: [Array],
      video_p50_watched_actions: [Array],
      video_p25_watched_actions: [Array],
      video_p100_watched_actions: [Array],
      video_play_actions: [Array],
      date_start: '2023-01-29',
      date_stop: '2023-02-27'
    },
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
  _targetClass: [Function: AdsInsights],
  paging: { cursors: { before: 'MAZDZD', after: 'MAZDZD' } },
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
