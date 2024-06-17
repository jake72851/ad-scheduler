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
    // geo 기준 추가
    'geographic_view.country_criterion_id',
    'geographic_view.location_type',

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
    // 'campaign.hotel_property_asset_set',
    'campaign.hotel_setting.hotel_center_id',
    'campaign.id',
    'campaign.labels',
    // 'campaign.listing_type',
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
    // 'campaign.target_cpm.target_frequency_goal.target_count',
    // 'campaign.target_cpm.target_frequency_goal.time_unit',
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
    // 'campaign.travel_campaign_settings.travel_account_id',
    'campaign.url_custom_parameters',
    'campaign.url_expansion_opt_out',
    'campaign.vanity_pharma.vanity_pharma_display_url_mode',
    'campaign.vanity_pharma.vanity_pharma_text',
    'campaign.video_brand_safety_suitability',

    // 요청날짜
    'segments.date',

    // 기본지표
    'metrics.absolute_top_impression_percentage',
    'metrics.all_conversions',
    'metrics.all_conversions_from_interactions_rate',
    'metrics.all_conversions_value',
    'metrics.average_cost',
    'metrics.average_cpc',
    'metrics.average_cpm',
    'metrics.average_cpv',
    'metrics.clicks',
    'metrics.conversions',
    'metrics.conversions_from_interactions_rate',
    'metrics.conversions_value',
    'metrics.cost_micros',
    'metrics.cost_per_all_conversions',
    'metrics.cost_per_conversion',
    'metrics.cross_device_conversions',
    'metrics.ctr',
    'metrics.impressions',
    'metrics.interaction_event_types',
    'metrics.interaction_rate',
    'metrics.interactions',
    'metrics.top_impression_percentage',
    'metrics.value_per_all_conversions',
    'metrics.value_per_conversion',
    'metrics.video_view_rate',
    'metrics.video_views',
    'metrics.view_through_conversions',

    // customer 기본정보
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
        geographic_view 
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
  // console.log('campaigns geo results =', result.data.results);

  if (result.data.results && result.data.results.length > 0) {
    const vad = await db.connection(CONFDB.DB.NAME);
    const googleGeoInfo = vad.collection(CONFDB.DB.GOOGLE.GEO);

    for (let i = 0; i < result.data.results.length; i++) {
      const geoResult = await googleGeoInfo.findOne({ id: result.data.results[i].geographicView.countryCriterionId });
      // console.log('geoResult =', geoResult);
      /*
        geoResult = {
          _id: new ObjectId("64588ae875128c3533e4dc8a"),
          apiId: 'googleGeoInfo',
          id: '2410',
          canonicalName: 'South Korea',
          countryCode: 'KR',
          createdTime: 2023-05-08T05:38:48.092Z,
          name: 'South Korea',
          resourceName: 'geoTargetConstants/2410',
          status: 'ENABLED',
          targetType: 'Country'
        }
      */
      result.data.results[i].geographicView.canonicalName = geoResult.canonicalName;
      result.data.results[i].geographicView.countryCode = geoResult.countryCode;
      // result.data.results[i].geographicView.geoName = geoResult.name;
      result.data.results[i].geographicView.targetType = geoResult.targetType;
    }

    const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

    const data = {
      userId,
      apiId: 'campaigns',
      dataType: 'insight',
      adAccountId: customerId,
      adAccountName: customerName,
      breakdowns: 'geo',
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
  geo results = [
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
      metrics: {
        interactionEventTypes: [Array],
        clicks: '4',
        topImpressionPercentage: 0.391304347826087,
        valuePerAllConversions: 1,
        videoViews: '0',
        viewThroughConversions: '0',
        conversionsFromInteractionsRate: 0,
        conversionsValue: 0,
        conversions: 0,
        costMicros: '3043000000',
        costPerAllConversions: 434714285.71428573,
        crossDeviceConversions: 0,
        ctr: 0.05714285714285714,
        absoluteTopImpressionPercentage: 0,
        allConversionsFromInteractionsRate: 1.75,
        allConversionsValue: 7,
        allConversions: 7,
        averageCost: 760750000,
        averageCpc: 760750000,
        averageCpm: 43471428571.42857,
        impressions: '70',
        interactionRate: 0.05714285714285714,
        interactions: '4'
      },
      segments: { date: '2023-03-23' },
      geographicView: {
        resourceName: 'customers/5318998392/geographicViews/2410~LOCATION_OF_PRESENCE',
        locationType: 'LOCATION_OF_PRESENCE',
        countryCriterionId: '2410'
      }
    }
  ]
*/
