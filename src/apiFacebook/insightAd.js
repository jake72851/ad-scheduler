const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
// const db = require('../db/connect');
// const CONFDB = require('../config/db');
// const dayjs = require('dayjs');
const AdInsight = require('../controllers/facebook/insight/ad');
// const wait = require('waait');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
// const AdAccount = adsSdk.AdAccount;
// const AdCreative = adsSdk.AdCreative;
// const Ad = adsSdk.Ad;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (userId, accountId, pageId, termDay) {
  // const waitTime = 500;
  // breakdown이 지정되지 않은 기본
  await AdInsight.reqBreakdown(userId, accountId, pageId, termDay, '', '');

  // 기본 breakdown 조최
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN.length; i++) {
    // 오류가 발생하는 breakdown는 제외
    // if (CONF.FACEBOOK.BREAKDOWN[i] !== 'image_asset, video_asset') {
    await AdInsight.reqBreakdown(userId, accountId, pageId, termDay, CONF.FACEBOOK.BREAKDOWN[i], '');
    // }
    // await wait(waitTime);
  }

  // 기본 action breakdown 조최
  for (let i = 0; i < CONF.FACEBOOK.ACTION_BREAKDOWN.length; i++) {
    // 오류가 발생하는 action breakdown는 제외
    // if (CONF.FACEBOOK.ACTION_BREAKDOWN[i] !== 'action_carousel_card_id, action_carousel_card_name, action_type') {
    await AdInsight.reqBreakdown(userId, accountId, pageId, termDay, '', CONF.FACEBOOK.ACTION_BREAKDOWN[i]);
    // }
    // await wait(waitTime);
  }

  // 다이내믹 크리에이트브 요소별 breakdown
  for (let i = 0; i < CONF.FACEBOOK.DYNAMIC_BREAKDOWN.length; i++) {
    // if (
    //   CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i] !== 'image_asset, video_asset, action_carousel_card_id, action_carousel_card_name' &&
    //   CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i] !== 'image_asset, action_carousel_card_id, action_carousel_card_name' &&
    //   CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i] !== 'video_asset, action_carousel_card_id, action_carousel_card_name'
    // ) {
    await AdInsight.reqBreakdown(userId, accountId, pageId, termDay, CONF.FACEBOOK.DYNAMIC_BREAKDOWN[i], '');
    // }
    // await wait(waitTime);
  }

  // 조합 BREAKDOWN_AND_ACTION_BREAKDOWN 조회
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN.length; i++) {
    // if (CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].break !== 'image_asset, video_asset') {
    // if (
    //   CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].action !==
    //   'action_carousel_card_id, action_carousel_card_name, action_type'
    // ) {
    await AdInsight.reqBreakdown(
      userId,
      accountId,
      pageId,
      termDay,
      CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].break,
      CONF.FACEBOOK.BREAKDOWN_AND_ACTION_BREAKDOWN[i].action
    );
    // }
    // }
    // await wait(waitTime);
  }

  // 조합 BREAKDOWN_AND_DYNAMIC_BREAKDOWN 이 없음
  for (let i = 0; i < CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN.length; i++) {
    await AdInsight.reqBreakdown(
      userId,
      accountId,
      pageId,
      termDay,
      CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN[i].break +
        ', ' +
        CONF.FACEBOOK.BREAKDOWN_AND_DYNAMIC_BREAKDOWN[i].dynamic,
      ''
    );
    // await wait(waitTime);
  }
};

/*
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
        'unique_actions',
        'unique_clicks',
        'unique_conversions',
        'unique_ctr',
        'unique_inline_link_click_ctr',
        'unique_inline_link_clicks',
        'unique_link_clicks_ctr',
        'unique_outbound_clicks',
        'unique_outbound_clicks_ctr',
        'unique_video_continuous_2_sec_watched_actions',
        'unique_video_view_15_sec',
        'updated_time',
        'video_15_sec_watched_actions',
        'video_30_sec_watched_actions',
        'video_avg_time_watched_actions',
        'video_continuous_2_sec_watched_actions',
        'video_p100_watched_actions',
        'video_p25_watched_actions',
        'video_p50_watched_actions',
        'video_p75_watched_actions',
        'video_p95_watched_actions',
        'video_play_actions',
        'video_play_curve_actions',
        'video_play_retention_0_to_15s_actions',
        'video_play_retention_20_to_60s_actions',
        'video_play_retention_graph_actions',
        'video_thruplay_watched_actions',
        'video_time_watched_actions',
        'website_ctr',
        'website_purchase_roas',
        'wish_bid'
    ]
*/
/*
imageUrlData = AdCreative {
  _data: {
    id: '23853978444800456',
    name: 'The best K-POP images archiving app. 2023-03-10-343f803afaec02bdd73a9c07777bd362'
  },
  _fields: [
    'account_id',
    'actor_id',
    'adlabels',
    'applink_treatment',
    'asset_feed_spec',
    'authorization_category',
    'auto_update',
    'body',
    'branded_content_sponsor_page_id',
    'bundle_folder_id',
    'call_to_action_type',
    'categorization_criteria',
    'category_media_source',
    'collaborative_ads_lsb_image_bank_id',
    'degrees_of_freedom_spec',
    'destination_set_id',
    'dynamic_ad_voice',
    'effective_authorization_category',
    'effective_instagram_media_id',
    'effective_instagram_story_id',
    'effective_object_story_id',
    'enable_direct_install',
    'enable_launch_instant_app',
    'id',
    'image_crops',
    'image_hash',
    'image_url',
    'instagram_actor_id',
    'instagram_permalink_url',
    'instagram_story_id',
    'instagram_user_id',
    'interactive_components_spec',
    'link_deep_link_url',
    'link_destination_display_url',
    'link_og_id',
    'link_url',
    'messenger_sponsored_message',
    'name',
    'object_id',
    'object_store_url',
    'object_story_id',
    'object_story_spec',
    'object_type',
    'object_url',
    'omnichannel_link_spec',
    'place_page_set_id',
    'platform_customizations',
    'playable_asset_id',
    'portrait_customizations',
    'product_set_id',
    'recommender_settings',
    'source_instagram_media_id',
    'status',
    'template_url',
    'template_url_spec',
    'thumbnail_id',
    'thumbnail_url',
    'title',
    'url_tags',
    'use_page_actor_override',
    'video_id'
  ],
  */
