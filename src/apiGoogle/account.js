const db = require('../db/connect');
const CONFDB = require('../config/db');
const CONF = require('../config/api');
// const { GoogleAdsApi } = require('google-ads-api');
const axios = require('axios');

const deviceInsight = require('../controllers/google/insight/device');
const ageInsight = require('../controllers/google/insight/age');
const genderInsight = require('../controllers/google/insight/gender');
const geoInsight = require('../controllers/google/insight/geo');
const biddingStrategyInsight = require('../controllers/google/insight/biddingStrategy');
const resultInsight = require('../controllers/google/insight/result');

// 구글 api 호출
exports.request = async function (accessToken, userId, customerId, customerName, termDay) {
  /*
  const client = new GoogleAdsApi({
    client_id: CONF.GOOGLE.CLIENT_ID,
    client_secret: CONF.GOOGLE.CLINET_SECRET,
    developer_token: CONF.GOOGLE.DEVELOPER_TOKEN,
  });

  // 하위 계정정보 요청
  const customer = client.Customer({
    customer_id: customerId,
    login_customer_id: CONF.GOOGLE.LOGIN_CUSTOMER_ID,
    refresh_token: accessToken,
  });
  // console.log('customerId =', customerId)
  */
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
    'metrics.active_view_cpm',
    'metrics.active_view_ctr',
    'metrics.active_view_impressions',
    'metrics.active_view_measurability',
    'metrics.active_view_measurable_cost_micros',
    'metrics.active_view_viewability',
    'metrics.active_view_measurable_impressions',
    'metrics.all_conversions',
    'metrics.all_conversions_by_conversion_date',
    'metrics.all_conversions_from_interactions_rate',
    'metrics.all_conversions_value',
    'metrics.all_conversions_value_by_conversion_date',
    'metrics.average_cost',
    'metrics.average_cpc',
    'metrics.average_cpe',
    'metrics.average_cpm',
    'metrics.average_cpv',
    'metrics.clicks',
    'metrics.content_budget_lost_impression_share',
    'metrics.content_impression_share',
    'metrics.content_rank_lost_impression_share',
    'metrics.conversions',
    'metrics.conversions_by_conversion_date',
    'metrics.conversions_from_interactions_rate',
    'metrics.conversions_value',
    'metrics.conversions_value_by_conversion_date',
    'metrics.cost_micros',
    'metrics.cost_per_all_conversions',
    'metrics.cost_per_conversion',
    'metrics.cross_device_conversions',
    'metrics.ctr',
    'metrics.engagement_rate',
    'metrics.engagements',
    'metrics.impressions',
    'metrics.interaction_event_types',
    'metrics.interaction_rate',
    'metrics.interactions',
    'metrics.invalid_click_rate',
    'metrics.invalid_clicks',
    'metrics.search_budget_lost_impression_share',
    'metrics.search_exact_match_impression_share',
    'metrics.search_impression_share',
    'metrics.search_rank_lost_impression_share',
    'metrics.sk_ad_network_conversions',
    'metrics.top_impression_percentage',
    'metrics.value_per_all_conversions',
    'metrics.value_per_all_conversions_by_conversion_date',
    'metrics.value_per_conversion',
    'metrics.value_per_conversions_by_conversion_date',
    'metrics.video_view_rate',
    'metrics.video_views',
    'metrics.view_through_conversions',

    // 요청날짜
    // 'segments.date',
  ];
  const selectFieldString = selectFields.join(', ');
  // console.log('selectFieldString =', selectFieldString);

  /*
  const query = await customer.query(`
    SELECT 
      ${selectFieldString} 
    FROM 
      customer
    WHERE 
      segments.date = '${termDay}'
  `);
  */
  const query = {
    query: `
      SELECT 
        ${selectFieldString} 
      FROM 
        customer 
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

  // if (query.length > 0) {
  if (result.data.results && result.data.results.length > 0) {
    const vad = await db.connection(CONFDB.DB.NAME);
    const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

    const data = {
      userId,
      apiId: 'adAccounts',
      dataType: 'insight',
      adAccountId: customerId,
      adAccountName: customerName,
      breakdowns: null,
      // data: query,
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

  // device 기준 요청
  await deviceInsight.request(accessToken, userId, customerId, customerName, termDay);
  // age 기준 요청
  await ageInsight.request(accessToken, userId, customerId, customerName, termDay);
  // gender 기준 요청
  await genderInsight.request(accessToken, userId, customerId, customerName, termDay);
  // geo 기준 요청
  await geoInsight.request(accessToken, userId, customerId, customerName, termDay);

  // bidding strategy 요청 - 데이터는 확인 못함 (광고계정 기준으로는 데이터가 없는듯함)
  await biddingStrategyInsight.request(accessToken, userId, customerId, customerName, termDay);

  // result 가준요청
  await resultInsight.request(accessToken, userId, customerId, customerName, termDay);

  return 'ok';
};
// console.log('customer_info =', query);
/*
  customer_info = [
    {
      customer: {
        auto_tagging_enabled: true,
        call_reporting_setting: [Object],
        conversion_tracking_setting: [Object],
        currency_code: 'KRW',
        descriptive_name: '더브이플래닛 내부광고계정',
        final_url_suffix: null,
        has_partners_badge: false,
        id: 5318998392,
        manager: false,
        optimization_score: null,
        optimization_score_weight: 0,
        pay_per_conversion_eligibility_failure_reasons: [Array],
        remarketing_setting: [Object],
        resource_name: 'customers/5318998392',
        status: 2,
        test_account: false,
        time_zone: 'Asia/Seoul',
        tracking_url_template: null
      },
      metrics: {
        absolute_top_impression_percentage: 0.11082474226804123,
        active_view_cpm: null,
        active_view_ctr: null,
        active_view_impressions: 0,
        active_view_measurability: 0,
        active_view_measurable_cost_micros: 0,
        active_view_viewability: null,
        active_view_measurable_impressions: 0,
        all_conversions: 187,
        all_conversions_by_conversion_date: 167,
        all_conversions_from_interactions_rate: 1.5454545454545454,
        all_conversions_value: 187,
        all_conversions_value_by_conversion_date: 167,
        average_cost: 668809917.355372,
        average_cpc: 668809917.355372,
        average_cpe: null,
        average_cpm: 26975333333.333332,
        average_cpv: null,
        clicks: 121,
        content_budget_lost_impression_share: null,
        content_impression_share: null,
        content_rank_lost_impression_share: null,
        conversions: 10,
        conversions_by_conversion_date: 9,
        conversions_from_interactions_rate: 0.08264462809917356,
        conversions_value: 10,
        conversions_value_by_conversion_date: 9,
        cost_micros: 80926000000,
        cost_per_all_conversions: 432759358.2887701,
        cost_per_conversion: 8092600000,
        cross_device_conversions: 6,
        ctr: 0.04033333333333333,
        engagement_rate: null,
        engagements: 0,
        impressions: 3000,
        interaction_event_types: [Array],
        interaction_rate: 0.04033333333333333,
        interactions: 121,
        invalid_click_rate: 0.016260162601626018,
        invalid_clicks: 2,
        search_budget_lost_impression_share: 0,
        search_exact_match_impression_share: 0.0999,
        search_impression_share: 0.0999,
        search_rank_lost_impression_share: 0.9001,
        sk_ad_network_conversions: 0,
        top_impression_percentage: 0.6630154639175257,
        value_per_all_conversions: 1,
        value_per_all_conversions_by_conversion_date: 1,
        value_per_conversion: 1,
        value_per_conversions_by_conversion_date: 1,
        video_view_rate: null,
        video_views: 0,
        view_through_conversions: 0
      }
    }
  ]
  */
