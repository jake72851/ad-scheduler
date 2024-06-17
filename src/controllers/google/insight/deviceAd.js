const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');
const CONF = require('../../../config/api');
// const { GoogleAdsApi, enums } = require('google-ads-api');
const axios = require('axios');

exports.request = async function (accessToken, userId, customerId, customerName, termDay) {
  const headers = {
    Authorization: 'Bearer ' + accessToken,
    'developer-token': CONF.GOOGLE.DEVELOPER_TOKEN,
    'login-customer-id': CONF.GOOGLE.LOGIN_CUSTOMER_ID,
  };
  const selectFields = [
    'ad_group_ad.action_items',
    'ad_group_ad.ad.added_by_google_ads',
    'ad_group_ad.ad.app_ad.descriptions',
    'ad_group_ad.ad.app_ad.headlines',
    'ad_group_ad.ad.app_ad.html5_media_bundles',
    'ad_group_ad.ad.app_ad.images',
    'ad_group_ad.ad.app_ad.mandatory_ad_text',
    'ad_group_ad.ad.app_ad.youtube_videos',
    'ad_group_ad.ad.app_engagement_ad.descriptions',
    'ad_group_ad.ad.app_engagement_ad.headlines',
    'ad_group_ad.ad.app_engagement_ad.images',
    'ad_group_ad.ad.app_engagement_ad.videos',
    'ad_group_ad.ad.app_pre_registration_ad.descriptions',
    'ad_group_ad.ad.app_pre_registration_ad.images',
    'ad_group_ad.ad.app_pre_registration_ad.youtube_videos',
    'ad_group_ad.ad.call_ad.business_name',
    'ad_group_ad.ad.call_ad.call_tracked',
    'ad_group_ad.ad.call_ad.conversion_action',
    'ad_group_ad.ad.call_ad.conversion_reporting_state',
    'ad_group_ad.ad.call_ad.country_code',
    'ad_group_ad.ad.call_ad.description1',
    'ad_group_ad.ad.call_ad.description2',
    'ad_group_ad.ad.call_ad.disable_call_conversion',
    'ad_group_ad.ad.call_ad.headline1',
    'ad_group_ad.ad.call_ad.headline2',
    'ad_group_ad.ad.call_ad.path1',
    'ad_group_ad.ad.call_ad.path2',
    'ad_group_ad.ad.call_ad.phone_number',
    'ad_group_ad.ad.call_ad.phone_number_verification_url',
    'ad_group_ad.ad.device_preference',
    'ad_group_ad.ad.discovery_carousel_ad.business_name',
    'ad_group_ad.ad.discovery_carousel_ad.call_to_action_text',
    'ad_group_ad.ad.discovery_carousel_ad.carousel_cards',
    'ad_group_ad.ad.discovery_carousel_ad.description',
    'ad_group_ad.ad.discovery_carousel_ad.headline',
    'ad_group_ad.ad.discovery_carousel_ad.logo_image',
    'ad_group_ad.ad.discovery_multi_asset_ad.business_name',
    'ad_group_ad.ad.discovery_multi_asset_ad.call_to_action_text',
    'ad_group_ad.ad.discovery_multi_asset_ad.descriptions',
    'ad_group_ad.ad.discovery_multi_asset_ad.headlines',
    'ad_group_ad.ad.discovery_multi_asset_ad.lead_form_only',
    'ad_group_ad.ad.discovery_multi_asset_ad.logo_images',
    'ad_group_ad.ad.discovery_multi_asset_ad.marketing_images',
    'ad_group_ad.ad.discovery_multi_asset_ad.portrait_marketing_images',
    'ad_group_ad.ad.discovery_multi_asset_ad.square_marketing_images',
    'ad_group_ad.ad.display_upload_ad.display_upload_product_type',
    'ad_group_ad.ad.display_upload_ad.media_bundle',
    'ad_group_ad.ad.display_url',
    'ad_group_ad.ad.expanded_dynamic_search_ad.description',
    'ad_group_ad.ad.expanded_dynamic_search_ad.description2',
    'ad_group_ad.ad.expanded_text_ad.description',
    'ad_group_ad.ad.expanded_text_ad.description2',
    'ad_group_ad.ad.expanded_text_ad.headline_part1',
    'ad_group_ad.ad.expanded_text_ad.headline_part2',
    'ad_group_ad.ad.expanded_text_ad.headline_part3',
    'ad_group_ad.ad.expanded_text_ad.path1',
    'ad_group_ad.ad.expanded_text_ad.path2',
    'ad_group_ad.ad.final_app_urls',
    'ad_group_ad.ad.final_mobile_urls',
    'ad_group_ad.ad.final_url_suffix',
    'ad_group_ad.ad.final_urls',
    'ad_group_ad.ad.hotel_ad',
    'ad_group_ad.ad.id',
    'ad_group_ad.ad.image_ad.image_url',
    'ad_group_ad.ad.image_ad.mime_type',
    'ad_group_ad.ad.image_ad.name',
    'ad_group_ad.ad.image_ad.pixel_height',
    'ad_group_ad.ad.image_ad.pixel_width',
    'ad_group_ad.ad.image_ad.preview_image_url',
    'ad_group_ad.ad.image_ad.preview_pixel_height',
    'ad_group_ad.ad.image_ad.preview_pixel_width',
    'ad_group_ad.ad.legacy_app_install_ad',
    'ad_group_ad.ad.legacy_responsive_display_ad.accent_color',
    'ad_group_ad.ad.legacy_responsive_display_ad.allow_flexible_color',
    'ad_group_ad.ad.legacy_responsive_display_ad.business_name',
    'ad_group_ad.ad.legacy_responsive_display_ad.call_to_action_text',
    'ad_group_ad.ad.legacy_responsive_display_ad.description',
    'ad_group_ad.ad.legacy_responsive_display_ad.format_setting',
    'ad_group_ad.ad.legacy_responsive_display_ad.logo_image',
    'ad_group_ad.ad.legacy_responsive_display_ad.long_headline',
    'ad_group_ad.ad.legacy_responsive_display_ad.main_color',
    'ad_group_ad.ad.legacy_responsive_display_ad.marketing_image',
    'ad_group_ad.ad.legacy_responsive_display_ad.price_prefix',
    'ad_group_ad.ad.legacy_responsive_display_ad.promo_text',
    'ad_group_ad.ad.legacy_responsive_display_ad.short_headline',
    'ad_group_ad.ad.legacy_responsive_display_ad.square_logo_image',
    'ad_group_ad.ad.legacy_responsive_display_ad.square_marketing_image',
    'ad_group_ad.ad.local_ad.call_to_actions',
    'ad_group_ad.ad.local_ad.descriptions',
    'ad_group_ad.ad.local_ad.headlines',
    'ad_group_ad.ad.local_ad.logo_images',
    'ad_group_ad.ad.local_ad.marketing_images',
    'ad_group_ad.ad.local_ad.path1',
    'ad_group_ad.ad.local_ad.path2',
    'ad_group_ad.ad.local_ad.videos',
    'ad_group_ad.ad.name',
    'ad_group_ad.ad.resource_name',
    'ad_group_ad.ad.responsive_display_ad.accent_color',
    'ad_group_ad.ad.responsive_display_ad.allow_flexible_color',
    'ad_group_ad.ad.responsive_display_ad.business_name',
    'ad_group_ad.ad.responsive_display_ad.call_to_action_text',
    'ad_group_ad.ad.responsive_display_ad.control_spec.enable_asset_enhancements',
    'ad_group_ad.ad.responsive_display_ad.control_spec.enable_autogen_video',
    'ad_group_ad.ad.responsive_display_ad.descriptions',
    'ad_group_ad.ad.responsive_display_ad.format_setting',
    'ad_group_ad.ad.responsive_display_ad.headlines',
    'ad_group_ad.ad.responsive_display_ad.logo_images',
    'ad_group_ad.ad.responsive_display_ad.long_headline',
    'ad_group_ad.ad.responsive_display_ad.main_color',
    'ad_group_ad.ad.responsive_display_ad.marketing_images',
    'ad_group_ad.ad.responsive_display_ad.price_prefix',
    'ad_group_ad.ad.responsive_display_ad.promo_text',
    'ad_group_ad.ad.responsive_display_ad.square_logo_images',
    'ad_group_ad.ad.responsive_display_ad.square_marketing_images',
    'ad_group_ad.ad.responsive_display_ad.youtube_videos',
    'ad_group_ad.ad.responsive_search_ad.descriptions',
    'ad_group_ad.ad.responsive_search_ad.headlines',
    'ad_group_ad.ad.responsive_search_ad.path1',
    'ad_group_ad.ad.responsive_search_ad.path2',
    'ad_group_ad.ad.shopping_comparison_listing_ad.headline',
    'ad_group_ad.ad.shopping_product_ad',
    'ad_group_ad.ad.shopping_smart_ad',
    'ad_group_ad.ad.smart_campaign_ad.descriptions',
    'ad_group_ad.ad.smart_campaign_ad.headlines',
    'ad_group_ad.ad.system_managed_resource_source',
    'ad_group_ad.ad.text_ad.description1',
    'ad_group_ad.ad.text_ad.description2',
    'ad_group_ad.ad.text_ad.headline',
    'ad_group_ad.ad.tracking_url_template',
    'ad_group_ad.ad.type',
    'ad_group_ad.ad.url_collections',
    'ad_group_ad.ad.url_custom_parameters',
    'ad_group_ad.ad.video_ad.bumper.companion_banner.asset',
    'ad_group_ad.ad.video_ad.in_feed.description1',
    'ad_group_ad.ad.video_ad.in_feed.description2',
    'ad_group_ad.ad.video_ad.in_feed.headline',
    'ad_group_ad.ad.video_ad.in_feed.thumbnail',
    'ad_group_ad.ad.video_ad.in_stream.action_button_label',
    'ad_group_ad.ad.video_ad.in_stream.action_headline',
    'ad_group_ad.ad.video_ad.in_stream.companion_banner.asset',
    'ad_group_ad.ad.video_ad.non_skippable.action_button_label',
    'ad_group_ad.ad.video_ad.non_skippable.action_headline',
    'ad_group_ad.ad.video_ad.non_skippable.companion_banner.asset',
    'ad_group_ad.ad.video_ad.out_stream.description',
    'ad_group_ad.ad.video_ad.out_stream.headline',
    'ad_group_ad.ad.video_ad.video.asset',
    'ad_group_ad.ad.video_responsive_ad.breadcrumb1',
    'ad_group_ad.ad.video_responsive_ad.breadcrumb2',
    'ad_group_ad.ad.video_responsive_ad.call_to_actions',
    'ad_group_ad.ad.video_responsive_ad.companion_banners',
    'ad_group_ad.ad.video_responsive_ad.descriptions',
    'ad_group_ad.ad.video_responsive_ad.headlines',
    'ad_group_ad.ad.video_responsive_ad.long_headlines',
    'ad_group_ad.ad.video_responsive_ad.videos',
    'ad_group_ad.ad_group',
    'ad_group_ad.ad_strength',
    'ad_group_ad.labels',
    'ad_group_ad.policy_summary.approval_status',
    'ad_group_ad.policy_summary.policy_topic_entries',
    'ad_group_ad.policy_summary.review_status',
    'ad_group_ad.resource_name',
    'ad_group_ad.status',

    'segments.date',
    'segments.device',

    'metrics.absolute_top_impression_percentage',
    'metrics.active_view_cpm',
    'metrics.active_view_ctr',
    'metrics.active_view_impressions',
    'metrics.active_view_measurability',
    'metrics.active_view_measurable_cost_micros',
    'metrics.active_view_measurable_impressions',
    'metrics.active_view_viewability',
    'metrics.all_conversions',
    'metrics.all_conversions_by_conversion_date',
    'metrics.all_conversions_from_interactions_rate',
    'metrics.all_conversions_value',
    'metrics.all_conversions_value_by_conversion_date',
    // 'metrics.auction_insight_search_absolute_top_impression_percentage',
    // 'metrics.auction_insight_search_impression_share',
    // 'metrics.auction_insight_search_outranking_share',
    // 'metrics.auction_insight_search_overlap_rate',
    // 'metrics.auction_insight_search_position_above_rate',
    // 'metrics.auction_insight_search_top_impression_percentage',
    'metrics.average_cost',
    'metrics.average_cpc',
    'metrics.average_cpe',
    'metrics.average_cpm',
    'metrics.average_cpv',
    // 'metrics.average_page_views',
    // 'metrics.average_time_on_site',
    // 'metrics.bounce_rate',
    'metrics.clicks',
    // 'metrics.content_impression_share',
    // 'metrics.content_rank_lost_impression_share',
    'metrics.conversions',
    'metrics.conversions_by_conversion_date',
    'metrics.conversions_from_interactions_rate',
    'metrics.conversions_value',
    'metrics.conversions_value_by_conversion_date',
    'metrics.cost_micros',
    'metrics.cost_per_all_conversions',
    'metrics.cost_per_conversion',
    'metrics.cost_per_current_model_attributed_conversion',
    'metrics.cross_device_conversions',
    'metrics.ctr',
    'metrics.current_model_attributed_conversions',
    'metrics.current_model_attributed_conversions_value',
    'metrics.engagement_rate',
    'metrics.engagements',
    'metrics.gmail_forwards',
    'metrics.gmail_saves',
    'metrics.gmail_secondary_clicks',
    'metrics.interaction_rate',
    'metrics.impressions',
    'metrics.interaction_event_types',
    'metrics.interaction_rate',
    'metrics.interactions',
    // 'metrics.percent_new_visitors',
    // 'metrics.phone_calls',
    // 'metrics.phone_impressions',
    // 'metrics.phone_through_rate',
    // 'metrics.relative_ctr',
    // 'metrics.search_absolute_top_impression_share',
    // 'metrics.search_budget_lost_absolute_top_impression_share',
    // 'metrics.search_budget_lost_top_impression_share',
    // 'metrics.search_exact_match_impression_share',
    // 'metrics.search_impression_share',
    // 'metrics.search_rank_lost_absolute_top_impression_share',
    // 'metrics.search_rank_lost_impression_share',
    // 'metrics.search_rank_lost_top_impression_share',
    // 'metrics.search_top_impression_share',
    'metrics.top_impression_percentage',
    'metrics.value_per_all_conversions',
    'metrics.value_per_all_conversions_by_conversion_date',
    'metrics.value_per_conversion',
    'metrics.value_per_conversions_by_conversion_date',
    'metrics.value_per_current_model_attributed_conversion',
    'metrics.video_quartile_p100_rate',
    'metrics.video_quartile_p25_rate',
    'metrics.video_quartile_p50_rate',
    'metrics.video_quartile_p75_rate',
    'metrics.video_view_rate',
    'metrics.video_views',
    'metrics.view_through_conversions',

    'ad_group.ad_rotation_mode',
    'ad_group.audience_setting.use_audience_grouped',
    'ad_group.base_ad_group',
    'ad_group.campaign',
    'ad_group.cpc_bid_micros',
    'ad_group.cpm_bid_micros',
    'ad_group.cpv_bid_micros',
    'ad_group.display_custom_bid_dimension',
    'ad_group.effective_cpc_bid_micros',
    'ad_group.effective_target_cpa_micros',
    'ad_group.effective_target_cpa_source',
    'ad_group.effective_target_roas',
    'ad_group.effective_target_roas_source',
    'ad_group.excluded_parent_asset_field_types',
    'ad_group.excluded_parent_asset_set_types',
    'ad_group.explorer_auto_optimizer_setting.opt_in',
    'ad_group.final_url_suffix',
    'ad_group.id',
    'ad_group.labels',
    'ad_group.name',
    'ad_group.percent_cpc_bid_micros',
    'ad_group.resource_name',
    'ad_group.status',
    'ad_group.target_cpa_micros',
    'ad_group.target_cpm_micros',
    'ad_group.target_roas',
    'ad_group.targeting_setting.target_restrictions',
    'ad_group.tracking_url_template',
    'ad_group.type',
    'ad_group.url_custom_parameters',

    'campaign.accessible_bidding_strategy',
    'campaign.ad_serving_optimization_status',
    'campaign.advertising_channel_sub_type',
    'campaign.advertising_channel_type',
    'campaign.app_campaign_setting.app_id',
    'campaign.app_campaign_setting.app_store',
    'campaign.app_campaign_setting.bidding_strategy_goal_type',
    'campaign.audience_setting.use_audience_grouped',
    'campaign.base_campaign',
    'campaign.bidding_strategy',
    'campaign.bidding_strategy_system_status',
    'campaign.bidding_strategy_type',
    'campaign.campaign_budget',
    'campaign.campaign_group',
    'campaign.commission.commission_rate_micros',
    'campaign.dynamic_search_ads_setting.domain_name',
    'campaign.dynamic_search_ads_setting.feeds',
    'campaign.dynamic_search_ads_setting.language_code',
    'campaign.dynamic_search_ads_setting.use_supplied_urls_only',
    'campaign.end_date',
    'campaign.excluded_parent_asset_field_types',
    'campaign.excluded_parent_asset_set_types',
    'campaign.experiment_type',
    'campaign.final_url_suffix',
    'campaign.frequency_caps',
    'campaign.geo_target_type_setting.negative_geo_target_type',
    'campaign.geo_target_type_setting.positive_geo_target_type',
    'campaign.hotel_setting.hotel_center_id',
    'campaign.id',
    'campaign.labels',
    'campaign.local_campaign_setting.location_source_type',
    'campaign.local_services_campaign_settings.category_bids',
    'campaign.manual_cpa',
    'campaign.manual_cpc.enhanced_cpc_enabled',
    'campaign.manual_cpm',
    'campaign.manual_cpv',
    'campaign.maximize_conversion_value.target_roas',
    'campaign.maximize_conversions.target_cpa_micros',
    'campaign.name',
    'campaign.network_settings.target_content_network',
    'campaign.network_settings.target_google_search',
    'campaign.network_settings.target_partner_search_network',
    'campaign.network_settings.target_search_network',
    'campaign.optimization_goal_setting.optimization_goal_types',
    'campaign.optimization_score',
    'campaign.payment_mode',
    'campaign.percent_cpc.cpc_bid_ceiling_micros',
    'campaign.percent_cpc.enhanced_cpc_enabled',
    'campaign.performance_max_upgrade.performance_max_campaign',
    'campaign.performance_max_upgrade.pre_upgrade_campaign',
    'campaign.performance_max_upgrade.status',
    'campaign.primary_status',
    'campaign.primary_status_reasons',
    'campaign.real_time_bidding_setting.opt_in',
    'campaign.resource_name',
    'campaign.selective_optimization.conversion_actions',
    'campaign.serving_status',
    'campaign.shopping_setting.campaign_priority',
    'campaign.shopping_setting.enable_local',
    'campaign.shopping_setting.feed_label',
    'campaign.shopping_setting.merchant_id',
    'campaign.shopping_setting.sales_country',
    'campaign.shopping_setting.use_vehicle_inventory',
    'campaign.start_date',
    'campaign.status',
    'campaign.target_cpa.cpc_bid_ceiling_micros',
    'campaign.target_cpa.cpc_bid_floor_micros',
    'campaign.target_cpa.target_cpa_micros',
    'campaign.target_impression_share.cpc_bid_ceiling_micros',
    'campaign.target_impression_share.location',
    'campaign.target_impression_share.location_fraction_micros',
    'campaign.target_roas.cpc_bid_ceiling_micros',
    'campaign.target_roas.cpc_bid_floor_micros',
    'campaign.target_roas.target_roas',
    'campaign.target_spend.cpc_bid_ceiling_micros',
    'campaign.target_spend.target_spend_micros',
    'campaign.targeting_setting.target_restrictions',
    'campaign.tracking_setting.tracking_url',
    'campaign.tracking_url_template',
    'campaign.url_custom_parameters',
    'campaign.url_expansion_opt_out',
    'campaign.vanity_pharma.vanity_pharma_display_url_mode',
    'campaign.vanity_pharma.vanity_pharma_text',
    'campaign.video_brand_safety_suitability',

    'customer.auto_tagging_enabled',
    'customer.call_reporting_setting.call_conversion_action',
    'customer.call_reporting_setting.call_conversion_reporting_enabled',
    'customer.call_reporting_setting.call_reporting_enabled',
    'customer.conversion_tracking_setting.accepted_customer_data_terms',
    'customer.conversion_tracking_setting.conversion_tracking_id',
    'customer.conversion_tracking_setting.conversion_tracking_status',
    'customer.conversion_tracking_setting.cross_account_conversion_tracking_id',
    'customer.conversion_tracking_setting.enhanced_conversions_for_leads_enabled',
    'customer.conversion_tracking_setting.google_ads_conversion_customer',
    'customer.currency_code',
    'customer.descriptive_name',
    'customer.final_url_suffix',
    'customer.has_partners_badge',
    'customer.id',
    'customer.manager',
    'customer.optimization_score',
    'customer.optimization_score_weight',
    'customer.pay_per_conversion_eligibility_failure_reasons',
    'customer.remarketing_setting.google_global_site_tag',
    'customer.resource_name',
    'customer.status',
    'customer.test_account',
    'customer.time_zone',
    'customer.tracking_url_template',
  ];
  const selectFieldString = selectFields.join(', ');
  const query = {
    query: `
      SELECT 
        ${selectFieldString} 
      FROM 
        ad_group_ad
      WHERE 
        segments.date = '${termDay}'
    `,
  };
  const result = await axios
    .post(CONF.GOOGLE.API + customerId + CONF.GOOGLE.API_END, query, { headers })
    .catch((error) => {
      // 오류 발생 시 오류 메시지 출력
      if (error.response) {
        // 응답이 도착한 경우
        console.log('응답 오류:', error.response.status);
        console.log('오류 메시지:', error.response.data);
        console.log('오류 메시지 details:', error.response.data.error.details);
        console.log('오류 메시지 details:', error.response.data.error.details[0].errors);
      } else if (error.request) {
        // 요청이 전송되지 않은 경우
        console.log('요청 오류:', error.request);
      } else {
        // 오류가 발생한 경우
        console.log('오류 메시지:', error.message);
      }
    });
  // console.log('ad device =', result.data.results);

  if (result.data.results && result.data.results.length > 0) {
    const vad = await db.connection(CONFDB.DB.NAME);
    const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

    const data = {
      userId,
      apiId: 'ads',
      dataType: 'insight',
      adAccountId: customerId,
      adAccountName: customerName,
      breakdowns: 'device',
      data: result.data.results,
      createdDay: termDay,
      createdAt: new Date(termDay + 'T00:00:00Z'),
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };
    await userGoogle.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        adAccountId: data.adAccountId,
        breakdowns: data.breakdowns,
        createdDay: data.createdDay,
      },
      { $set: data },
      { upsert: true }
    );
  }

  return 'ok';
};
/*
ad device = [
  {
    customer: {
      resourceName: 'customers/5318998392',
      callReportingSetting: [Object],
      conversionTrackingSetting: [Object],
      remarketingSetting: [Object],
      payPerConversionEligibilityFailureReasons: [Array],
      id: '5318998392',
      descriptiveName: '더브이플래닛 내부광고계정',
      currencyCode: 'KRW',
      timeZone: 'Asia/Seoul',
      autoTaggingEnabled: true,
      hasPartnersBadge: false,
      manager: false,
      testAccount: false,
      status: 'ENABLED'
    },
    campaign: {
      resourceName: 'customers/5318998392/campaigns/19420534263',
      status: 'ENABLED',
      adServingOptimizationStatus: 'OPTIMIZE',
      advertisingChannelType: 'SEARCH',
      networkSettings: [Object],
      experimentType: 'BASE',
      servingStatus: 'SERVING',
      biddingStrategyType: 'MAXIMIZE_CONVERSIONS',
      targetingSetting: [Object],
      geoTargetTypeSetting: [Object],
      paymentMode: 'CLICKS',
      baseCampaign: 'customers/5318998392/campaigns/19420534263',
      name: '2_브이플레이트_SA(확장)',
      id: '19420534263',
      campaignBudget: 'customers/5318998392/campaignBudgets/12221891674',
      startDate: '2022-12-30',
      endDate: '2037-12-30',
      biddingStrategySystemStatus: 'PAUSED',
      primaryStatus: 'ELIGIBLE'
    },
    adGroup: {
      resourceName: 'customers/5318998392/adGroups/144839605837',
      status: 'ENABLED',
      type: 'SEARCH_STANDARD',
      adRotationMode: 'OPTIMIZE',
      targetingSetting: [Object],
      id: '144839605837',
      name: '2_1_브이플레이트(확장)_221230',
      baseAdGroup: 'customers/5318998392/adGroups/144839605837',
      campaign: 'customers/5318998392/campaigns/19420534263',
      cpcBidMicros: '1000000',
      cpmBidMicros: '1000000',
      targetCpaMicros: '0',
      cpvBidMicros: '0',
      targetCpmMicros: '1000000',
      effectiveTargetCpaMicros: '0'
    },
    metrics: {
      interactionEventTypes: [Array],
      clicks: '3',
      topImpressionPercentage: 0.39473684210526316,
      valuePerAllConversions: 1,
      videoViews: '0',
      viewThroughConversions: '0',
      conversionsFromInteractionsRate: 0,
      conversionsValue: 0,
      conversions: 0,
      costMicros: '2969000000',
      costPerAllConversions: 494833333.3333333,
      crossDeviceConversions: 0,
      ctr: 0.05454545454545454,
      currentModelAttributedConversions: 0,
      currentModelAttributedConversionsValue: 0,
      engagements: '0',
      absoluteTopImpressionPercentage: 0,
      activeViewImpressions: '0',
      activeViewMeasurability: 0,
      activeViewMeasurableCostMicros: '0',
      activeViewMeasurableImpressions: '0',
      allConversionsFromInteractionsRate: 2,
      allConversionsValue: 6,
      allConversions: 6,
      averageCost: 989666666.6666666,
      averageCpc: 989666666.6666666,
      averageCpm: 53981818181.81818,
      gmailForwards: '0',
      gmailSaves: '0',
      gmailSecondaryClicks: '0',
      impressions: '55',
      interactionRate: 0.05454545454545454,
      interactions: '3',
      allConversionsValueByConversionDate: 11,
      allConversionsByConversionDate: 11,
      valuePerAllConversionsByConversionDate: 1
    },
    adGroupAd: {
      resourceName: 'customers/5318998392/adGroupAds/144839605837~643215999328',
      status: 'ENABLED',
      ad: [Object],
      policySummary: [Object],
      adStrength: 'EXCELLENT',
      adGroup: 'customers/5318998392/adGroups/144839605837'
    },
    segments: { device: 'DESKTOP', date: '2023-03-23' }
  },
]
 */
