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
    'bidding_strategy.aligned_campaign_budget_id',
    'bidding_strategy.campaign_count',
    'bidding_strategy.currency_code',
    'bidding_strategy.effective_currency_code',
    'bidding_strategy.enhanced_cpc',
    'bidding_strategy.id',
    'bidding_strategy.maximize_conversion_value.cpc_bid_ceiling_micros',
    'bidding_strategy.maximize_conversion_value.cpc_bid_floor_micros',
    'bidding_strategy.maximize_conversion_value.target_roas',
    'bidding_strategy.maximize_conversions.cpc_bid_ceiling_micros',
    'bidding_strategy.maximize_conversions.cpc_bid_floor_micros',
    'bidding_strategy.maximize_conversions.target_cpa_micros',
    'bidding_strategy.name',
    'bidding_strategy.non_removed_campaign_count',
    'bidding_strategy.resource_name',
    'bidding_strategy.status',
    'bidding_strategy.target_cpa.cpc_bid_ceiling_micros',
    'bidding_strategy.target_cpa.cpc_bid_floor_micros',
    'bidding_strategy.target_cpa.target_cpa_micros',
    'bidding_strategy.target_impression_share.cpc_bid_ceiling_micros',
    'bidding_strategy.target_impression_share.location',
    'bidding_strategy.target_impression_share.location_fraction_micros',
    'bidding_strategy.target_roas.cpc_bid_ceiling_micros',
    'bidding_strategy.target_roas.cpc_bid_floor_micros',
    'bidding_strategy.target_roas.target_roas',
    'bidding_strategy.target_spend.cpc_bid_ceiling_micros',
    'bidding_strategy.target_spend.target_spend_micros',
    'bidding_strategy.type',

    // 'segments.date',

    'metrics.all_conversions',
    'metrics.all_conversions_from_interactions_rate',
    'metrics.all_conversions_value',
    'metrics.average_cpc',
    'metrics.average_cpm',
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
    'metrics.value_per_all_conversions',
    'metrics.value_per_conversion',
    'metrics.view_through_conversions',

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
      bidding_strategy 
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
  // console.log('account bidding strategy =', result.data.results);
  // account bidding strategy = undefined

  if (result.data.results && result.data.results.length > 0) {
    const vad = await db.connection(CONFDB.DB.NAME);
    const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

    const data = {
      userId,
      apiId: 'adAccounts',
      dataType: 'biddingStrategy',
      adAccountId: customerId,
      adAccountName: customerName,
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
        createdDay: data.createdDay,
      },
      { $set: data },
      { upsert: true }
    );
  }

  return 'ok';
};
