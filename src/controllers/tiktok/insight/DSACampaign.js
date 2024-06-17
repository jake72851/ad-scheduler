const axios = require('axios');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');

exports.request = async function (userId, advertiserIds, advertiserName, termDay, dimensionAdd) {
  const requestPageSize = CONF.TIKTOK.API_REQUESTPAGESIZE;

  const dimension = [
    // ID dimensions >
    // 'advertiser_id',
    'campaign_id',
    // 'adgroup_id',
    // 'ad_id',

    // Time dimensions >
    // 'stat_time_day', // 포함시 활성화된 캠페인만 출력되는것으로 예상

    // DSA dimensions > dimensionAdd pram으로 대치
    // ['catalog_id'],
    // ['product_set_id'],
    // ['product_id'],
    // ['sku_id'],
  ];

  const datas = {
    advertiser_id: advertiserIds,
    service_type: 'AUCTION', // 광고 서비스 유형. 열거형 값: AUCTION(경매 광고), RESERVATION(예약 광고). 기본값: AUCTION.
    data_level: 'AUCTION_CAMPAIGN', // ['AUCTION_ADVERTISER', 'RESERVATION_AD', 'RESERVATION_ADGROUP', 'AUCTION_ADGROUP', 'RESERVATION_CAMPAIGN', 'AUCTION_AD', 'AUCTION_CAMPAIGN', 'RESERVATION_ADVERTISER']
    report_type: 'CATALOG', // Report type. Enum values: BASIC (basic report), AUDIENCE (audience report), PLAYABLE_MATERIAL (playable ads report), CATALOG (DSA report).

    dimensions: [...dimension, ...dimensionAdd],

    metrics: [
      // Attribute metrics >
      'catalog_name',
      'product_set_name',
      'product_name',
      'campaign_name',
      // 'campaign_id', // Supported at Ad Group and Ad level.
      // 'adgroup_name',
      // 'placement_type', // Supported at Ad Group and Ad level.
      // 'adgroup_id',
      // 'ad_name', // Supported at Ad level.
      // 'ad_text', // Supported at Ad level.
      // 'product_image', // Supported at Ad level.
      // 'tt_app_id', // TikTok App ID, the App ID you used when creating an Ad Group. Supported at Ad Group and Ad level. Returned if the promotion type of one Ad Group is App.
      // 'tt_app_name', // The name of your TikTok App. Supported at Ad Group and Ad level. Returned if the promotion type of one Ad Group is App.
      // 'mobile_app_id', // Supported at Ad Group and Ad level.
      // 'promotion_type', // It can be app, website, or others. Supported at Ad Group and Ad levels in both synchronous and asynchronous reports.
      // 'dpa_target_audience_type', // Supported at Adgroup or Ad levels in both synchronous and asynchronous reports.

      // Basic data metrics >
      'impressions',
      'clicks',
      'spend',
      // 'conversion', // this statistic is not supported for campaigns
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      'ctr',
      'cpc',
      'cpm',
      // 'real_time_result', // this statistic is not supported for campaigns
      // 'real_time_cost_per_result', // this statistic is not supported for campaigns
      // 'real_time_result_rate', // this statistic is not supported for campaigns
      // 'result', // this statistic is not supported for campaigns
      // 'cost_per_result', // this statistic is not supported for campaigns
      // 'result_rate', // this statistic is not supported for campaigns
      'currency',

      // In-App Event metrics >
      // Real-time App Install
      'real_time_app_install',
      'real_time_app_install_cost',
      // App Install
      'app_install',
      'cost_per_app_install',
      // Registration
      'registration',
      'cost_per_registration',
      'registration_rate',
      'total_registration',
      'cost_per_total_registration',
      // Purchase
      'purchase',
      'cost_per_purchase',
      'purchase_rate',
      'total_purchase',
      'cost_per_total_purchase',
      'value_per_total_purchase',
      'total_purchase_value',
      'total_active_pay_roas',
      // Add to Cart
      'app_event_add_to_cart',
      'cost_per_app_event_add_to_cart',
      'app_event_add_to_cart_rate',
      'total_app_event_add_to_cart',
      'cost_per_total_app_event_add_to_cart',
      'value_per_total_app_event_add_to_cart',
      'total_app_event_add_to_cart_value',
      // Checkout
      'checkout',
      'cost_per_checkout',
      'checkout_rate',
      'total_checkout',
      'cost_per_total_checkout',
      'value_per_checkout',
      'total_checkout_value',
      // View Content
      'view_content',
      'cost_per_view_content',
      'view_content_rate',
      'total_view_content',
      'cost_per_total_view_content',
      'value_per_total_view_content',
      'total_view_content_value',
      // Day 1 Retention
      'next_day_open',
      'cost_per_next_day_open',
      'next_day_open_rate',
      'total_next_day_open',
      'cost_per_total_next_day_open',
      // Add Payment Info
      'add_payment_info',
      'cost_per_add_payment_info',
      'add_payment_info_rate',
      'total_add_payment_info',
      'cost_total_add_payment_info',
      // Add to Wishlist
      'add_to_wishlist',
      'cost_per_add_to_wishlist',
      'add_to_wishlist_rate',
      'total_add_to_wishlist',
      'cost_per_total_add_to_wishlist',
      'value_per_total_add_to_wishlist',
      'total_add_to_wishlist_value',
      // Launch App
      'launch_app',
      'cost_per_launch_app',
      'launch_app_rate',
      'total_launch_app',
      'cost_per_total_launch_app',
      // Complete Tutorial
      'complete_tutorial',
      'cost_per_complete_tutorial',
      'complete_tutorial_rate',
      'total_complete_tutorial',
      'cost_per_total_complete_tutorial',
      'value_per_total_complete_tutorial',
      'total_complete_tutorial_value',
      // Create Group
      'create_group',
      'cost_per_create_group',
      'create_group_rate',
      'total_create_group',
      'cost_per_total_create_group',
      'value_per_total_create_group',
      'total_create_group_value',
      // Join Group
      'join_group',
      'cost_per_join_group',
      'join_group_rate',
      'total_join_group',
      'cost_per_total_join_group',
      'value_per_total_join_group',
      'total_join_group_value',
      // Create Role
      'create_gamerole',
      'cost_per_create_gamerole',
      'create_gamerole_rate',
      'total_create_gamerole',
      'cost_per_total_create_gamerole',
      'value_per_total_create_gamerole',
      'total_create_gamerole_value',
      // Spend Credit
      'spend_credits',
      'cost_per_spend_credits',
      'spend_credits_rate',
      'total_spend_credits',
      'cost_per_total_spend_credits',
      'value_per_total_spend_credits',
      'total_spend_credits_value',
      // Achieve Level
      'achieve_level',
      'cost_per_achieve_level',
      'achieve_level_rate',
      'total_achieve_level',
      'cost_per_total_achieve_level',
      'value_per_total_achieve_level',
      'total_achieve_level_value',
      // Unlock Achievement
      'unlock_achievement',
      'cost_per_unlock_achievement',
      'unlock_achievement_rate',
      'total_unlock_achievement',
      'cost_per_total_unlock_achievement',
      'value_per_total_unlock_achievement',
      'total_unlock_achievement_value',
      // Generate Lead
      'sales_lead',
      'cost_per_sales_lead',
      'sales_lead_rate',
      'total_sales_lead',
      'cost_per_total_sales_lead',
      'value_per_total_sales_lead',
      'total_sales_lead_value',
      // In-App Ad Click
      'in_app_ad_click',
      'cost_per_in_app_ad_click',
      'in_app_ad_click_rate',
      'total_in_app_ad_click',
      'cost_per_total_in_app_ad_click',
      'value_per_total_in_app_ad_click',
      'total_in_app_ad_click_value',
      // In-App Ad Impression
      'in_app_ad_impr',
      'cost_per_in_app_ad_impr',
      'in_app_ad_impr_rate',
      'total_in_app_ad_impr',
      'cost_per_total_in_app_ad_impr',
      'value_per_total_in_app_ad_impr',
      'total_in_app_ad_impr_value',
      // Loan Apply
      'loan_apply',
      'cost_per_loan_apply',
      'loan_apply_rate',
      'total_loan_apply',
      'cost_per_total_loan_apply',
      // Loan Approval
      'loan_credit',
      'cost_per_loan_credit',
      'loan_credit_rate',
      'total_loan_credit',
      'cost_per_total_loan_credit',
      // Loan Disbursal
      'loan_disbursement',
      'cost_per_loan_disbursement',
      'loan_disbursement_rate',
      'total_loan_disbursement',
      'cost_per_total_loan_disbursement',
      // Login
      'login',
      'cost_per_login',
      'login_rate',
      'total_login',
      'cost_per_total_login',
      // Rate
      'ratings',
      'cost_per_ratings',
      'ratings_rate',
      'total_ratings',
      'cost_per_total_ratings',
      'value_per_total_ratings',
      'total_ratings_value',
      // Search
      'search',
      'cost_per_search',
      'search_rate',
      'total_search',
      'cost_per_total_search',
      // Start Trial
      'start_trial',
      'cost_per_start_trial',
      'start_trial_rate',
      'total_start_trial',
      'cost_per_total_start_trial',
      // Subscribe
      'subscribe',
      'cost_per_subscribe',
      'subscribe_rate',
      'total_subscribe',
      'cost_per_total_subscribe',
      'value_per_total_subscribe',
      'total_subscribe_value',

      // Page event metrics >
      // Complete Payment ROAS
      'complete_payment_roas',
      // Complete Payment
      'complete_payment',
      'cost_per_complete_payment',
      'complete_payment_rate',
      'value_per_complete_payment',
      'total_complete_payment_rate',
      // Click Button
      'value_per_button_click',
      'total_button_click_value',
      // Complete Registration
      'user_registration',
      'cost_per_user_registration',
      'user_registration_rate',
      'value_per_user_registration',
      'total_user_registration_value',
      // Add to Cart
      'web_event_add_to_cart',
      'cost_per_web_event_add_to_cart',
      'web_event_add_to_cart_rate',
      'value_per_web_event_add_to_cart',
      'total_web_event_add_to_cart_value',
      // Place an Order
      'on_web_order',
      'cost_per_on_web_order',
      'on_web_order_rate',
      'value_per_on_web_order',
      'total_on_web_order_value',
      // Initiate Checkout
      'initiate_checkout',
      'cost_per_initiate_checkout',
      'initiate_checkout_rate',
      'value_per_initiate_checkout',
      'total_initiate_checkout_value',
      // Add Payment Info
      'add_billing',
      'cost_per_add_billing',
      'add_billing_rate',
      'value_per_add_billing',
      'total_add_billing_value',
      // Search
      'page_event_search',
      'cost_per_page_event_search',
      'page_event_search_rate',
      'value_per_page_event_search',
      'total_page_event_search_value',
      // Submit Form
      'form',
      'cost_per_form',
      'form_rate',
      'value_per_form',
      'total_form_value',
      // Download
      'download_start',
      'cost_per_download_start',
      'download_start_rate',
      'value_per_download_start',
      'total_download_start_value',
      // Add to Wishlist
      'on_web_add_to_wishlist',
      'cost_per_on_web_add_to_wishlist',
      'on_web_add_to_wishlist_per_click',
      'value_per_on_web_add_to_wishlist',
      'total_on_web_add_to_wishlist_value',
      // Subscribe
      'on_web_subscribe',
      'cost_per_on_web_subscribe',
      'on_web_subscribe_per_click',
      'value_per_on_web_subscribe',
      'total_on_web_subscribe_value',
    ],

    page: 1,
    page_size: requestPageSize,
    start_date: termDay,
    end_date: termDay,
    // filters: [
    //   {
    //     field_name: 'campaign_ids',
    //     filter_type: 'IN',
    //     filter_value: [item.campaign_id],
    //   },
    // ],
  };

  const config = {
    method: 'GET',
    url: CONF.TIKTOK.API + CONF.TIKTOK.API_INSIGHT,
    headers: {
      'Access-Token': CONF.TIKTOK.ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: datas,
  };
  const result = await axios(config);
  // console.log('캠페인 DSA 인사이트 result =', result);

  const dimensionJoin = dimensionAdd.join(', ');

  if (result.data.message !== 'OK') {
    console.log('캠페인 DSA ' + dimensionJoin + ' 인사이트 err =', result.data.message);
  } else {
    console.log('캠페인 DSA ' + dimensionJoin + ' 인사이트 result page_info =', result.data.data.page_info);
    // console.log('캠페인 DSA ' + dimensionJoin + ' 인사이트 result list =', result.data.data.list);
    console.log('캠페인 DSA ' + dimensionJoin + ' 인사이트 result list.length =', result.data.data.list.length);

    const arr = result.data.data.list;
    for (let i = 1; i < result.data.data.page_info.total_page; i++) {
      console.log('page num =', i + 1);
      datas.page = i + 1;
      const result = await axios(config);
      arr.push(...result.data.data.list);
    }
    // console.log('arr =', arr);
    console.log('캠페인 DSA ', dimensionJoin, ' arr.length =', arr.length);

    if (arr.length > 0) {
      const vad = await db.connection(CONFDB.DB.NAME);
      const userTiktok = vad.collection(CONFDB.DB.TIKTOK.COLLECTION);
      const data = {
        userId,
        apiId: 'campaigns',
        dataType: 'insight',
        adAccountId: advertiserIds,
        adAccountName: advertiserName,
        serviceType: 'AUCTION',
        reportType: 'CATALOG', // report_type
        breakdowns: dimensionJoin,
        data: arr,
        createdDay: termDay,
        createdAt: new Date(termDay + 'T00:00:00Z'),
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      await userTiktok.updateOne(
        {
          userId: data.userId,
          apiId: data.apiId,
          dataType: data.dataType,
          adAccountId: data.adAccountId,
          serviceType: data.serviceType,
          reportType: data.reportType,
          breakdowns: data.breakdowns,
          createdDay: data.createdDay,
        },
        { $set: data },
        { upsert: true }
      );
    }
  }
};
