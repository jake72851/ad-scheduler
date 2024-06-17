const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');
const resultMappingAds = require('../../../util/facebookResultMappingAds');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const AdCreative = adsSdk.AdCreative;
const Ad = adsSdk.Ad;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.reqBreakdown = async function (userId, accountId, pageId, termDay, breakdown, actionBreakdown) {
  // ad의 경우, 갯수가 많아 페이스북 오류가 발생 > ad별로 나눠서 처리
  const account = new AdAccount(accountId);
  const fieldsAcc = ['id', 'name', 'campaign_id', 'adset_id'];
  const paramsAcc = {
    time_range: { since: termDay, until: termDay },
    // filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let adInfos = await account.getAds(fieldsAcc, paramsAcc);
  // console.log('adInfos =', adInfos);
  /*
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
  */

  const resultIds = [];
  adInfos.map((element) => resultIds.push(element._data));
  while (adInfos.hasNext()) {
    adInfos = await adInfos.next();
    adInfos.map((element) => resultIds.push(element._data));
  }
  // console.log('ad id 정보 =', resultIds);
  /*
  result = [
    { id: '23854193691580456', name: 'SpkADS_NJ17' },
    { id: '23854135075170456', name: '7_2_NJ13' },
    { id: '23854136652160456', name: '7_1_NJ13' },
    { id: '23854136652150456', name: '7_1_NJ10' },
    { id: '23854136652140456', name: '7_1_NJ7' },
    { id: '23854136652130456', name: '7_1_NJ2' },
    { id: '23854136652120456', name: '7_1_NJ9' },
    { id: '23854136652110456', name: '7_1_NJ1' },
    { id: '23854136652100456', name: '7_1_NJ6' },
    { id: '23854136652090456', name: '7_1_NJ11' },
    { id: '23854136652080456', name: '7_1_NJ12' },
    { id: '23854136652070456', name: '7_1_NJ8' },
    { id: '23854136652060456', name: '7_1_NJ14' },
    { id: '23854136652040456', name: '7_1_NJ3' },
    { id: '23854136652030456', name: '7_1_NJ4' },
    { id: '23854135079580456', name: '7_2_NJ14' },
    { id: '23854135079730456', name: '7_2_NJ7' },
    { id: '23854135080300456', name: '7_2_NJ4' },
    { id: '23854135080740456', name: '7_2_NJ5' },
    { id: '23854135080700456', name: '7_2_NJ3' },
    { id: '23854135080220456', name: '7_2_NJ6' },
    { id: '23854135079980456', name: '7_2_NJ9' },
    { id: '23854135079880456', name: '7_2_NJ10' },
    { id: '23854135075270456', name: '7_2_NJ12' },
    { id: '23854135062530456', name: '7_2_NJ1' }
  ]
  */
  console.log('ad.length =', resultIds.length);

  for (const [index, value] of resultIds.entries()) {
    console.log(' ');
    console.log(index);
    console.log('value.id =', value.id);
    console.log('value.name =', value.name);

    const ad = new Ad(value.id);
    /*
    const fieldsInsight = [
      'account_id',
      'account_name',
      'action_values',
      'actions',

      // ad용 지표
      'ad_id',
      'ad_name',
      'adset_id',
      'adset_name',
      'attribution_setting',

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
      // level: 'ad',
      time_range: { since: termDay, until: termDay },
      // filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
    };

    if (actionBreakdown) {
      paramsInsight.actionBreakdowns = actionBreakdown;
    }
    if (breakdown) {
      paramsInsight.breakdowns = breakdown;
    }

    let insights = await ad.getInsights(fieldsInsight, paramsInsight);
    console.log('insights breakdowns =', breakdown);
    console.log('insights action_breakdowns =', actionBreakdown);
    // console.log('insights ad =', insights);
    /*
    account_currency
    account_id
    account_name
    action_values
    actions
    ad_bid_value
    ad_click_actions
    ad_id
    ad_impression_actions
    ad_name
    adset_bid_value
    adset_end
    adset_id
    adset_name
    adset_start
    age_targeting
    attribution_setting
    auction_bid
    auction_competitiveness
    auction_max_competitor_bid
    buying_type
    campaign_id
    campaign_name
    canvas_avg_view_percent
    canvas_avg_view_time
    catalog_segment_actions
    catalog_segment_value
    catalog_segment_value_mobile_purchase_roas
    catalog_segment_value_omni_purchase_roas
    catalog_segment_value_website_purchase_roas
    clicks
    conversion_rate_ranking
    conversion_values
    conversions
    converted_product_quantity
    converted_product_value
    cost_per_15_sec_video_view
    cost_per_2_sec_continuous_video_view
    cost_per_action_type
    cost_per_ad_click
    cost_per_conversion
    cost_per_dda_countby_convs
    cost_per_estimated_ad_recallers
    cost_per_inline_link_click
    cost_per_inline_post_engagement
    cost_per_one_thousand_ad_impression
    cost_per_outbound_click
    cost_per_thruplay
    cost_per_unique_action_type
    cost_per_unique_click
    cost_per_unique_conversion
    cost_per_unique_inline_link_click
    cost_per_unique_outbound_click
    cpc
    cpm
    cpp
    created_time
    ctr
    date_start
    date_stop
    dda_countby_convs
    dda_results
    engagement_rate_ranking
    estimated_ad_recall_rate
    estimated_ad_recall_rate_lower_bound
    estimated_ad_recall_rate_upper_bound
    estimated_ad_recallers
    estimated_ad_recallers_lower_bound
    estimated_ad_recallers_upper_bound
    frequency
    full_view_impressions
    full_view_reach
    gender_targeting
    impressions
    inline_link_click_ctr
    inline_link_clicks
    inline_post_engagement
    instant_experience_clicks_to_open
    instant_experience_clicks_to_start
    instant_experience_outbound_clicks
    interactive_component_tap
    labels
    location
    mobile_app_purchase_roas
    objective
    optimization_goal
    outbound_clicks
    outbound_clicks_ctr
    place_page_name
    purchase_roas
    qualifying_question_qualify_answer_rate
    quality_ranking
    quality_score_ectr
    quality_score_ecvr
    quality_score_organic
    reach
    social_spend
    spend
    total_postbacks
    total_postbacks_detailed
    unique_actions
    unique_clicks
    unique_conversions
    unique_ctr
    unique_inline_link_click_ctr
    unique_inline_link_clicks
    unique_link_clicks_ctr
    unique_outbound_clicks
    unique_outbound_clicks_ctr
    unique_video_continuous_2_sec_watched_actions
    unique_video_view_15_sec
    updated_time
    video_15_sec_watched_actions
    video_30_sec_watched_actions
    video_avg_time_watched_actions
    video_continuous_2_sec_watched_actions
    video_p100_watched_actions
    video_p25_watched_actions
    video_p50_watched_actions
    video_p75_watched_actions
    video_p95_watched_actions
    video_play_actions
    video_play_curve_actions
    video_play_retention_0_to_15s_actions
    video_play_retention_20_to_60s_actions
    video_play_retention_graph_actions
    video_thruplay_watched_actions
    video_time_watched_actions
    website_ctr
    website_purchase_roas
    wish_bid
    */

    const result = [];
    insights.map((element) => result.push(element._data));

    while (insights.hasNext()) {
      insights = await insights.next();
      insights.map((element) => result.push(element._data));
    }
    console.log('insights ad insights =', result);
    console.log('insights ad insights.length =', result.length);

    if (result.length > 0) {
      // 결과 관련 정보 확인
      for (const item of result) {
        const resultValue = await resultMappingAds.request(
          item.actions,
          item.objective,
          item.optimization_goal,
          item.conversions,
          item.conversion_values
        );
        item.result = resultValue;
      }

      // const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
      // const userFacebook = vad.collection('user_' + userId + '_facebook_insight');
      const vad = await db.connection(CONFDB.DB.NAME);
      const userFacebook = vad.collection(CONFDB.DB.FACEBOOK.COLLECTION);

      // const ad = new Ad(value.ad_id);
      const adInfo = await ad.read([Ad.Fields.creative]);
      console.log('adInfo._data.creative.id =', adInfo._data.creative.id);
      // console.log('adInfo =', adInfo);
      /*
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
      ]
      */

      const fieldsCreative = ['name', 'id', 'object_story_spec', 'thumbnail_url'];
      // const fields = ['name', 'id', 'thumbnail_url'];
      const paramsCreative = {};
      const imageUrlData = await new AdCreative(adInfo._data.creative.id).get(fieldsCreative, paramsCreative);
      // console.log('imageUrlData =', imageUrlData);
      /*
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
      ]
      */

      let imageUrl, thumbnailUrl;
      if (imageUrlData._data.object_story_spec && imageUrlData._data.object_story_spec.video_data) {
        // console.log('imageUrlData._data.object_story_spec =', imageUrlData._data.object_story_spec);
        imageUrl = imageUrlData._data.object_story_spec.video_data.image_url;
      } else {
        imageUrl = '';
      }
      if (imageUrlData._data.thumbnail_url) {
        thumbnailUrl = imageUrlData._data.thumbnail_url;
      } else {
        thumbnailUrl = '';
      }

      const data = {
        userId,
        apiId: 'ads',
        dataType: 'insight',
        adAccountId: accountId,
        campaignId: value.campaign_id,
        adSetId: value.adset_id,
        adId: value.id,
        adName: value.name,
        breakdowns: paramsInsight.breakdowns,
        actionBreakdowns: paramsInsight.actionBreakdowns,
        data: result,
        imageUrl,
        thumbnailUrl,
        creativeId: adInfo._data.creative.id,
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
          adId: data.id,
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
