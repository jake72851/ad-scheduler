const db = require('../db/connect');
const CONFDB = require('../config/db');
const CONF = require('../config/api');
// const { GoogleAdsApi } = require('google-ads-api');
// const dayjs = require('dayjs');
const axios = require('axios');

// 구글 api 호출
exports.request = async function (accessToken, userId, customerId, customerName) {
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
  // console.log('customer_id =', customer_id)

  const query = await customer.query(`
    SELECT 
      account_budget.adjusted_spending_limit_micros, 
      account_budget.adjusted_spending_limit_type, 
      account_budget.amount_served_micros, 
      account_budget.approved_end_date_time, 
      account_budget.approved_end_time_type, 
      account_budget.approved_spending_limit_micros, 
      account_budget.approved_spending_limit_type, 
      account_budget.approved_start_date_time, 
      account_budget.billing_setup, 
      account_budget.id, 
      account_budget.name, 
      account_budget.notes, 
      account_budget.pending_proposal.account_budget_proposal, 
      account_budget.pending_proposal.creation_date_time, 
      account_budget.pending_proposal.end_date_time, 
      account_budget.pending_proposal.end_time_type, 
      account_budget.pending_proposal.name, 
      account_budget.pending_proposal.notes, 
      account_budget.pending_proposal.proposal_type, 
      account_budget.pending_proposal.purchase_order_number, 
      account_budget.pending_proposal.spending_limit_micros, 
      account_budget.pending_proposal.spending_limit_type, 
      account_budget.pending_proposal.start_date_time, 
      account_budget.proposed_end_date_time, 
      account_budget.proposed_end_time_type, 
      account_budget.proposed_spending_limit_micros, 
      account_budget.proposed_spending_limit_type, 
      account_budget.proposed_start_date_time, 
      account_budget.purchase_order_number, 
      account_budget.resource_name, 
      account_budget.status, 
      account_budget.total_adjustments_micros, 

      billing_setup.end_date_time,
      billing_setup.end_time_type,
      billing_setup.id,
      billing_setup.payments_account,
      billing_setup.payments_account_info.payments_account_id,
      billing_setup.payments_account_info.payments_account_name,
      billing_setup.payments_account_info.payments_profile_id,
      billing_setup.payments_account_info.payments_profile_name,
      billing_setup.payments_account_info.secondary_payments_profile_id,
      billing_setup.resource_name,
      billing_setup.start_date_time,
      billing_setup.status,

      customer.auto_tagging_enabled,
      customer.call_reporting_setting.call_conversion_action,
      customer.call_reporting_setting.call_conversion_reporting_enabled,
      customer.call_reporting_setting.call_reporting_enabled,
      customer.conversion_tracking_setting.accepted_customer_data_terms,
      customer.conversion_tracking_setting.conversion_tracking_id,
      customer.conversion_tracking_setting.conversion_tracking_status,
      customer.conversion_tracking_setting.cross_account_conversion_tracking_id,
      customer.conversion_tracking_setting.enhanced_conversions_for_leads_enabled,
      customer.conversion_tracking_setting.google_ads_conversion_customer,
      customer.currency_code,
      customer.descriptive_name,
      customer.final_url_suffix,
      customer.has_partners_badge,
      customer.id,
      customer.image_asset_auto_migration_done,
      customer.image_asset_auto_migration_done_date_time,
      customer.location_asset_auto_migration_done,
      customer.location_asset_auto_migration_done_date_time,
      customer.manager,
      customer.optimization_score,
      customer.optimization_score_weight,
      customer.pay_per_conversion_eligibility_failure_reasons,
      customer.remarketing_setting.google_global_site_tag,
      customer.resource_name,
      customer.status,
      customer.test_account,
      customer.time_zone,
      customer.tracking_url_template
    FROM account_budget 
  `);

  */
  const headers = {
    Authorization: 'Bearer ' + accessToken,
    'developer-token': CONF.GOOGLE.DEVELOPER_TOKEN,
    'login-customer-id': CONF.GOOGLE.LOGIN_CUSTOMER_ID,
  };
  const selectFields = [
    'account_budget.adjusted_spending_limit_micros',
    'account_budget.adjusted_spending_limit_type',
    'account_budget.amount_served_micros',
    'account_budget.approved_end_date_time',
    'account_budget.approved_end_time_type',
    'account_budget.approved_spending_limit_micros',
    'account_budget.approved_spending_limit_type',
    'account_budget.approved_start_date_time',
    'account_budget.billing_setup',
    'account_budget.id',
    'account_budget.name',
    'account_budget.notes',
    'account_budget.pending_proposal.account_budget_proposal',
    'account_budget.pending_proposal.creation_date_time',
    'account_budget.pending_proposal.end_date_time',
    'account_budget.pending_proposal.end_time_type',
    'account_budget.pending_proposal.name',
    'account_budget.pending_proposal.notes',
    'account_budget.pending_proposal.proposal_type',
    'account_budget.pending_proposal.purchase_order_number',
    'account_budget.pending_proposal.spending_limit_micros',
    'account_budget.pending_proposal.spending_limit_type',
    'account_budget.pending_proposal.start_date_time',
    'account_budget.proposed_end_date_time',
    'account_budget.proposed_end_time_type',
    'account_budget.proposed_spending_limit_micros',
    'account_budget.proposed_spending_limit_type',
    'account_budget.proposed_start_date_time',
    'account_budget.purchase_order_number',
    'account_budget.resource_name',
    'account_budget.status',
    'account_budget.total_adjustments_micros',

    'billing_setup.end_date_time',
    'billing_setup.end_time_type',
    'billing_setup.id',
    'billing_setup.payments_account',
    'billing_setup.payments_account_info.payments_account_id',
    'billing_setup.payments_account_info.payments_account_name',
    'billing_setup.payments_account_info.payments_profile_id',
    'billing_setup.payments_account_info.payments_profile_name',
    'billing_setup.payments_account_info.secondary_payments_profile_id',
    'billing_setup.resource_name',
    'billing_setup.start_date_time',
    'billing_setup.status',

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
    // 'customer.image_asset_auto_migration_done',
    // 'customer.image_asset_auto_migration_done_date_time',
    // 'customer.location_asset_auto_migration_done',
    // 'customer.location_asset_auto_migration_done_date_time',
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
        account_budget 
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
      dataType: 'budget',
      adAccountId: customerId,
      adAccountName: customerName,
      // data: query,
      data: result.data.results,
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };
    await userGoogle.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        adAccountId: data.adAccountId,
      },
      { $set: data },
      { upsert: true }
    );
  }
};
// console.log('account_budget =', query);
/*
  account_budget = [
    {
      account_budget: {
        adjusted_spending_limit_micros: null,
        adjusted_spending_limit_type: 2,
        amount_served_micros: 11534882000000,
        approved_end_date_time: null,
        approved_end_time_type: 3,
        approved_spending_limit_micros: null,
        approved_spending_limit_type: 2,
        approved_start_date_time: '2022-01-20 14:57:55',
        billing_setup: 'customers/5318998392/billingSetups/6522323757',
        id: 6701172717,
        name: '',
        notes: null,
        pending_proposal: null,
        proposed_end_date_time: null,
        proposed_end_time_type: 3,
        proposed_spending_limit_micros: null,
        proposed_spending_limit_type: 2,
        proposed_start_date_time: '2022-01-20 14:57:55',
        purchase_order_number: null,
        resource_name: 'customers/5318998392/accountBudgets/6701172717',
        status: 3,
        total_adjustments_micros: 9016000000
      },
      billing_setup: {
        end_date_time: null,
        end_time_type: 3,
        id: 6522323757,
        payments_account: 'customers/5318998392/paymentsAccounts/4470-2701-5355-2897',
        payments_account_info: [Object],
        resource_name: 'customers/5318998392/billingSetups/6522323757',
        start_date_time: '2022-01-20 14:57:55',
        status: 4
      },
      customer: {
        auto_tagging_enabled: true,
        call_reporting_setting: [Object],
        conversion_tracking_setting: [Object],
        currency_code: 'KRW',
        descriptive_name: '더브이플래닛 내부광고계정',
        final_url_suffix: null,
        has_partners_badge: false,
        id: 5318998392,
        image_asset_auto_migration_done: false,
        image_asset_auto_migration_done_date_time: null,
        location_asset_auto_migration_done: false,
        location_asset_auto_migration_done_date_time: null,
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
      }
    }
  ]
*/
