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

    // 기본지표
    'metrics.absolute_top_impression_percentage',
    // 'metrics.active_view_cpm',
    // 'metrics.active_view_ctr',
    // 'metrics.active_view_impressions',
    // 'metrics.active_view_measurability',
    // 'metrics.active_view_measurable_cost_micros',
    // 'metrics.active_view_measurable_impressions',
    // 'metrics.active_view_viewability',
    'metrics.all_conversions',
    // 'metrics.all_conversions_by_conversion_date',
    'metrics.all_conversions_from_interactions_rate',
    'metrics.all_conversions_value',
    // 'metrics.all_conversions_value_per_cost',
    'metrics.average_cost',
    'metrics.average_cpc',
    // 'metrics.average_cpe',
    'metrics.average_cpm',
    'metrics.average_cpv',
    'metrics.clicks',
    // 'metrics.content_budget_lost_impression_share',
    // 'metrics.content_impression_share',
    // 'metrics.content_rank_lost_impression_share',
    'metrics.conversions',
    // 'metrics.conversions_by_conversion_date',
    'metrics.conversions_from_interactions_rate',
    'metrics.conversions_value',
    // 'metrics.conversions_value_by_conversion_date',
    'metrics.cost_micros',
    'metrics.cost_per_all_conversions',
    'metrics.cost_per_conversion',
    'metrics.cross_device_conversions',
    'metrics.ctr',
    // 'metrics.engagement_rate',
    // 'metrics.engagements',
    // 'metrics.gmail_forwards',
    // 'metrics.gmail_saves',
    // 'metrics.gmail_secondary_clicks',
    'metrics.impressions',
    'metrics.interaction_event_types',
    'metrics.interaction_rate',
    'metrics.interactions',
    // 'metrics.invalid_click_rate',
    // 'metrics.invalid_clicks',
    // 'metrics.search_budget_lost_impression_share',
    // 'metrics.search_exact_match_impression_share',
    // 'metrics.search_impression_share',
    // 'metrics.search_rank_lost_impression_share',
    // 'metrics.sk_ad_network_conversions',
    'metrics.top_impression_percentage',
    'metrics.value_per_all_conversions',
    // 'metrics.value_per_all_conversions_by_conversion_date',
    'metrics.value_per_conversion',
    // 'metrics.value_per_conversions_by_conversion_date',
    // 'metrics.video_quartile_p100_rate',
    // 'metrics.video_quartile_p25_rate',
    // 'metrics.video_quartile_p50_rate',
    // 'metrics.video_quartile_p75_rate',
    'metrics.video_view_rate',
    'metrics.video_views',
    'metrics.view_through_conversions',

    // 요청날짜
    'segments.date',

    // geo 기준 추가
    'geographic_view.country_criterion_id',
    'geographic_view.location_type',
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
  const result = await axios.post(CONF.GOOGLE.API + customerId + CONF.GOOGLE.API_END, query, { headers });

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
      apiId: 'adAccounts',
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
// console.log('result.data.results =', result.data.results);
/*
  result.data.results = [
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
