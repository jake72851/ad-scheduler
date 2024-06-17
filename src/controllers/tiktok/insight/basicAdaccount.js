const axios = require('axios');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');

exports.request = async function (userId, advertiserIds, advertiserName, termDay, dimensionAdd) {
  const requestPageSize = CONF.TIKTOK.API_REQUESTPAGESIZE;

  const dimension = dimensionAdd.map((element) => {
    if (element === 'AD_LEVEL') {
      return 'advertiser_id';
    } else {
      return element;
    }
  });
  console.log('광고계정 dimension =', dimension);
  // ID dimensions >
  // 'advertiser_id',
  // 'campaign_id',
  // 'adgroup_id',
  // 'ad_id',

  // Time dimensions >
  // 'stat_time_day', // 포함시 활성화된 캠페인만 출력되는것으로 예상
  // 'stat_time_hour',

  // etc dimensions >
  // 'country_code',
  // 'custom_event_type',
  // 'ad_type',
  // 'image_id',

  const metricBasic = [
    // Attribute metrics >
    // 'campaign_name', // advertiser_id 지원안함
    // 'campaign_id', // Supported at Ad Group and Ad level.
    // 'objective_type', // advertiser_id 지원안함
    // 'split_test', // advertiser_id 지원안함
    // 'campaign_budget', // advertiser_id 지원안함
    // 'campaign_dedicate_type', // advertiser_id 지원안함
    'app_promotion_type',
    // 'adgroup_name',
    // 'adgroup_id',
    // 'placement_type', // Supported at Ad Group and Ad level.
    // 'promotion_type', // It can be app, website, or others. Supported at Ad Group and Ad levels in both synchronous and asynchronous reports.
    // 'opt_status', // Supported at Ad Group and Ad level.
    // 'dpa_target_audience_type', // The Audience that DPA products target. Supported at Ad Group or Ad levels in both synchronous and asynchronous reports.
    // 'budget', // Supported at Ad Group and Ad level.
    // 'smart_target', // Supported at Ad Group and Ad level.
    // 'pricing_category', // Supported at Ad Group and Ad level.
    // 'bid_strategy', // Supported at Ad Group and Ad level.
    // 'bid', // Supported at Ad Group and Ad level.
    // 'aeo_type', // Supported at Ad Group and Ad level. (Already supported at Ad Group level, and will be supported at Ad level)
    // 'ad_name', // Supported at Ad level.
    // 'ad_text', // Supported at Ad level.
    // 'call_to_action', // Supported at Ad level.
    // 'tt_app_id', // TikTok App ID, the App ID you used when creating an Ad Group. Supported at Ad Group and Ad level. Returned if the promotion type of one Ad Group is App.
    // 'tt_app_name', // The name of your TikTok App. Supported at Ad Group and Ad level. Returned if the promotion type of one Ad Group is App.
    // 'mobile_app_id', // Supported at Ad Group and Ad level.
    // 'image_mode', // Please correct the information in invalid metric fields and try again. Invalid metric fields: ['image_mode'].

    // Basic data metrics >
    'spend',
    'cash_spend',
    'voucher_spend',
    'cpc',
    'cpm',
    'impressions',
    'gross_impressions',
    'clicks',
    'ctr',
    'reach',
    'cost_per_1000_reached',
    // 'conversion', // 선택한 두 번째 목표를 기준으로 광고가 결과를 달성한 횟수입니다. 하나의 캠페인에 다양한 2차 목표가 있을 수 있으므로 이 통계는 캠페인에 대해 지원되지 않습니다. 보려면 광고그룹 또는 광고로 이동하세요. (총 횟수는 각 광고 노출이 발생한 시간을 기준으로 계산됩니다.)
    'cost_per_conversion', // CPA
    'conversion_rate', // CVR (%)
    'real_time_conversion',
    'real_time_cost_per_conversion',
    'real_time_conversion_rate',
    // 'result', // 광고계정, 캠페인 지원안함
    // 'cost_per_result', // 광고계정, 캠페인 지원안함
    // 'result_rate', // 광고계정, 캠페인 지원안함
    // 'real_time_result', // 광고계정, 캠페인 지원안함
    // 'real_time_cost_per_result', // 광고계정, 캠페인 지원안함
    // 'real_time_result_rate', // 광고계정, 캠페인 지원안함
    // 'secondary_goal_result', // 캠페인 지원안함(광고계정은 표시안되어 있음)
    // 'cost_per_secondary_goal_result', // 캠페인 지원안함(광고계정은 표시안되어 있음)
    // 'secondary_goal_result_rate', // 캠페인 지원안함(광고계정은 표시안되어 있음)
    'frequency',
    'currency',

    // Video play metrics >
    'video_play_actions',
    'video_watched_2s',
    'video_watched_6s',
    'average_video_play',
    'average_video_play_per_user',
    'video_views_p25',
    'video_views_p50',
    'video_views_p75',
    'video_views_p100',
    'engaged_view',
    'engaged_view_15s',

    // Engagement metrics >
    'engagements',
    'engagement_rate',
    // 'profile_visits', // This metric is only for Spark Ads.
    // 'profile_visits_rate', // This metric is only for Spark Ads.
    'likes',
    'comments',
    'shares',
    'follows',
    'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.
    'duet_clicks',
    'stitch_clicks',
    'sound_usage_clicks',
    'anchor_clicks',
    'anchor_click_rate',
    'clicks_on_hashtag_challenge', // 캠페인 기간 동안 광고의 해시태그 챌린지에 대한 총 클릭 수입니다.
    'ix_page_duration_avg',
    'ix_page_viewrate_avg',
    'ix_video_views',
    'ix_video_views_p25',
    'ix_video_views_p50',
    'ix_video_views_p75',
    'ix_video_views_p100',
    'ix_average_video_play',
    // 'single_image_impressions', // Only supported for the image_id dimension
    // 'single_image_impression_rate', // Only supported for the image_id dimension
    // 'single_image_ctr', // Only supported for the image_id dimension

    // Interactive Add-on metrics >
    'interactive_add_on_impressions',
    'interactive_add_on_destination_clicks',
    'interactive_add_on_activity_clicks',
    'interactive_add_on_option_a_clicks',
    'interactive_add_on_option_b_clicks',
    'countdown_sticker_recall_clicks',

    // LIVE metrics >
    'live_views',
    'live_unique_views',
    'live_effective_views',
    'live_product_clicks',

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
    // Custom App Event
    'unique_custom_app_events',
    'cost_per_unique_custom_app_event',
    'custom_app_event_rate',
    'custom_app_events',
    'cost_per_custom_app_event',
    'value_per_custom_app_event',
    'custom_app_events_value',

    // Onsite event metrics >
    // Complete Payment ROAS (Onsite)
    'onsite_shopping_roas',
    // Complete Payment (Onsite)
    'onsite_shopping',
    'cost_per_onsite_shopping',
    'onsite_shopping_rate',
    'value_per_onsite_shopping',
    'total_onsite_shopping_value',
    // Initiate Checkout (Onsite)
    'onsite_initiate_checkout_count',
    'cost_per_onsite_initiate_checkout_count',
    'onsite_initiate_checkout_count_rate',
    'value_per_onsite_initiate_checkout_count',
    'total_onsite_initiate_checkout_count_value',
    // Product Details Page View (Onsite)
    'onsite_on_web_detail',
    'cost_per_onsite_on_web_detail',
    'onsite_on_web_detail_rate',
    'value_per_onsite_on_web_detail',
    'total_onsite_on_web_detail_value',
    // Add to Wishlist (Onsite)
    'onsite_add_to_wishlist',
    'cost_per_onsite_add_to_wishlist',
    'onsite_add_to_wishlist_rate',
    'value_per_onsite_add_to_wishlist',
    'total_onsite_add_to_wishlist_value',
    // Add Billing (Onsite)
    'onsite_add_billing',
    'cost_per_onsite_add_billing',
    'onsite_add_billing_rate',
    'value_per_onsite_add_billing',
    'total_onsite_add_billing_value',
    // Add to Cart (Onsite)
    'onsite_on_web_cart',
    'cost_per_onsite_on_web_cart',
    'onsite_on_web_cart_rate',
    'value_per_onsite_on_web_cart',
    'total_onsite_on_web_cart_value',
    // Form Submission (Onsite)
    'onsite_form',
    'cost_per_onsite_form',
    'onsite_form_rate',
    'value_per_onsite_form',
    'total_onsite_form_value',
    // App Store Click (Onsite)
    'onsite_download_start',
    'cost_per_onsite_download_start',
    'onsite_download_start_rate',
    // Page Views (Onsite)
    'ix_page_view_count',
    'cost_per_ix_page_view_count',
    'ix_page_view_count_rate',
    // Call-to-Action Button Clicks (Onsite)
    'ix_button_click_count',
    'cost_per_ix_button_click_count',
    'ix_button_click_count_rate',
    // Product Clicks (Onsite)
    'ix_product_click_count',
    'cost_per_ix_product_click_count',
    'ix_product_click_count_rate',

    // Page event metrics >
    // Complete Payment ROAS
    'complete_payment_roas',
    // Complete Payment
    'complete_payment',
    'cost_per_complete_payment',
    'complete_payment_rate',
    'value_per_complete_payment',
    'total_complete_payment_rate',
    // Landing Page View
    'total_landing_page_view',
    'cost_per_landing_page_view',
    'landing_page_view_rate',
    // Page View
    'total_pageview',
    'cost_per_pageview',
    'pageview_rate',
    'avg_value_per_pageview',
    'total_value_per_pageview',
    // Click Button
    'button_click',
    'cost_per_button_click',
    'button_click_rate',
    'value_per_button_click',
    'total_button_click_value',
    // Contact
    'online_consult',
    'cost_per_online_consult',
    'online_consult_rate',
    'value_per_online_consult',
    'total_online_consult_value',
    // Complete Registration
    'user_registration',
    'cost_per_user_registration',
    'user_registration_rate',
    'value_per_user_registration',
    'total_user_registration_value',
    // View Content
    'product_details_page_browse',
    'cost_per_product_details_page_browse',
    'product_details_page_browse_rate',
    'value_per_product_details_page_browse',
    'total_product_details_page_browse_value',
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
    // Custom Page Event
    'custom_page_events',
    'cost_per_custom_page_event',
    'custom_page_event_rate',
    'value_per_custom_page_event',
    'custom_page_events_value',

    // Attribution metrics >
    'vta_app_install',
    'cost_per_vta_app_install',
    'vta_conversion',
    'cost_per_vta_conversion',
    'vta_registration',
    'cost_per_vta_registration',
    'vta_purchase',
    'cost_per_vta_purchase',
    'cta_app_install',
    'cost_per_cta_app_install',
    'cta_conversion',
    'cost_per_cta_conversion',
    'cta_registration',
    'cost_per_cta_registration',
    'cta_purchase',
    'cost_per_cta_purchase',

    // Offline event metrics >
    // Complete Payment (Offline)
    'offline_shopping_events',
    'cost_per_offline_shopping_event',
    'offline_shopping_event_rate',
    'value_per_offline_shopping_event',
    'offline_shopping_events_value',
    // Complete Payment ROAS (Offline)
    'offline_shopping_events_roas',
    // Contact (Offline)
    'offline_contact_events',
    'cost_per_offline_contact_event',
    'offline_contact_event_rate',
    'value_per_offline_contact_event',
    'offline_contact_events_value',
    // Subscribe (Offline)
    'offline_subscribe_events',
    'cost_per_offline_subscribe_event',
    'offline_subscribe_event_rate',
    'value_per_offline_subscribe_event',
    'offline_subscribe_events_value',
    // Submit Form (Offline)
    'offline_form_events',
    'cost_per_offline_form_event',
    'offline_form_event_rate',
    'value_per_offline_form_event',
    'offline_form_events_value',
    // Add Payment Info (Offline)
    'offline_add_payment_info_events',
    'cost_per_offline_add_payment_info_event',
    'offline_add_payment_info_event_rate',
    'value_per_offline_add_payment_info_event',
    'offline_add_payment_info_events_value',
    // Add to Cart (Offline)
    'offline_add_to_cart_events',
    'cost_per_offline_add_to_cart_event',
    'offline_add_to_cart_event_rate',
    'value_per_offline_add_to_cart_event',
    'offline_add_to_cart_events_value',
    // Add to Wishlist (Offline)
    'offline_add_to_wishlist_events',
    'cost_per_offline_add_to_wishlist_event',
    'offline_add_to_wishlist_event_rate',
    'value_per_offline_add_to_wishlist_event',
    'offline_add_to_wishlist_events_value',
    // Click Button (Offline)
    'offline_click_button_events',
    'cost_per_offline_click_button_event',
    'offline_click_button_event_rate',
    'value_per_offline_click_button_event',
    'offline_click_button_events_value',
    // Complete Registration (Offline)
    'offline_complete_registration_events',
    'cost_per_offline_complete_registration_event',
    'offline_complete_registration_event_rate',
    'value_per_offline_complete_registration_event',
    'offline_complete_registration_events_value',
    // Download (Offline)
    'offline_download_events',
    'cost_per_offline_download_event',
    'offline_download_event_rate',
    'value_per_offline_download_event',
    'offline_download_events_value',
    // Initiate Checkout (Offline)
    'offline_initiate_checkout_events',
    'cost_per_offline_initiate_checkout_event',
    'offline_initiate_checkout_event_rate',
    'value_per_offline_initiate_checkout_event',
    'offline_initiate_checkout_events_value',
    // Place an Order (Offline)
    'offline_place_order_events',
    'cost_per_offline_place_order_event',
    'offline_place_order_event_rate',
    'value_per_offline_place_order_event',
    'offline_place_order_events_value',
    // Search (Offline)
    'offline_search_events',
    'cost_per_offline_search_event',
    'offline_search_event_rate',
    'value_per_offline_search_event',
    'offline_search_events_value',
    // View Content (Offline)
    'offline_view_content_events',
    'cost_per_offline_view_content_event',
    'offline_view_content_event_rate',
    'value_per_offline_view_content_event',
    'offline_view_content_events_value',

    // SKAN metrics >
    // Basic data metrics (SKAN)
    // 'skan_result', // 캠페인 지원안함
    // 'skan_cost_per_result', // 캠페인 지원안함
    // 'skan_result_rate', // 캠페인 지원안함
    'skan_conversion',
    'skan_cost_per_conversion',
    'skan_conversion_rate',
    'skan_click_time_conversion',
    'skan_click_time_cost_per_conversion',
    'skan_click_time_conversion_rate',

    // In-App Event metrics (SKAN)
    // App Install (SKAN)
    'skan_app_install',
    'skan_cost_per_app_install',
    // App Installs (SKAN Privacy Withheld)
    'skan_app_install_withheld',
    // Registration (SKAN)
    'skan_registration',
    'skan_cost_per_registration',
    'skan_registration_rate',
    'skan_total_registration',
    'skan_cost_per_total_registration',
    // Purchase (SKAN)
    'skan_purchase',
    'skan_cost_per_purchase',
    'skan_purchase_rate',
    'skan_total_purchase',
    'skan_cost_per_total_purchase',
    'skan_total_purchase_value',
    'skan_total_repetitive_active_pay_roas',
    // Add to Cart (SKAN)
    'skan_add_to_cart',
    'skan_cost_per_add_to_cart',
    'skan_add_to_cart_rate',
    'skan_total_add_to_cart',
    'skan_cost_per_total_add_to_cart',
    'skan_total_add_to_cart_value',
    // Checkout (SKAN)
    'skan_checkout',
    'skan_cost_per_checkout',
    'skan_checkout_rate',
    'skan_total_checkout',
    'skan_cost_per_total_checkout',
    'skan_total_checkout_value',
    // View Content (SKAN)
    'skan_view_content',
    'skan_cost_per_view_content',
    'skan_view_content_rate',
    'skan_total_view_content',
    'skan_cost_per_total_view_content',
    'skan_total_view_content_value',
    // Add Payment Info (SKAN)
    'skan_add_payment_info',
    'skan_cost_per_add_payment_info',
    'skan_add_payment_info_rate',
    'skan_total_add_payment_info',
    'skan_cost_total_add_payment_info',
    // Add to Wishlist (SKAN)
    'skan_add_to_wishlist',
    'skan_cost_per_add_to_wishlist',
    'skan_add_to_wishlist_rate',
    'skan_total_add_to_wishlist',
    'skan_cost_per_total_add_to_wishlist',
    'skan_total_add_to_wishlist_value',
    // Launch App (SKAN)
    'skan_launch_app',
    'skan_cost_per_launch_app',
    'skan_launch_app_rate',
    'skan_total_launch_app',
    'skan_cost_per_total_launch_app',
    // Complete Tutorial (SKAN)
    'skan_total_complete_tutorial',
    'skan_cost_per_total_complete_tutorial',
    'skan_complete_tutorial',
    'skan_cost_per_complete_tutorial',
    'skan_complete_tutorial_rate',
    'skan_total_complete_tutorial_value',
    // Create Group (SKAN)
    'skan_create_group',
    'skan_cost_per_create_group',
    'skan_create_group_rate',
    'skan_total_create_group',
    'skan_cost_per_total_create_group',
    'skan_total_create_group_value',
    // Join Group (SKAN)
    'skan_join_group',
    'skan_cost_per_join_group',
    'skan_join_group_rate',
    'skan_total_join_group',
    'skan_cost_per_total_join_group',
    'skan_total_join_group_value',
    // Create Role (SKAN)
    'skan_create_gamerole',
    'skan_cost_per_create_gamerole',
    'skan_create_gamerole_rate',
    'skan_total_create_gamerole',
    'skan_cost_per_total_create_gamerole',
    'skan_total_create_gamerole_value',
    // Spend Credit (SKAN)
    'skan_spend_credits',
    'skan_cost_per_spend_credits',
    'skan_spend_credits_rate',
    'skan_total_spend_credits',
    'skan_cost_per_total_spend_credits',
    'skan_total_spend_credits_value',
    // Achieve Level (SKAN)
    'skan_achieve_level',
    'skan_cost_per_achieve_level',
    'skan_achieve_level_rate',
    'skan_total_achieve_level',
    'skan_cost_per_total_achieve_level',
    'skan_total_achieve_level_value',
    // Unlock Achievement (SKAN)
    'skan_unlock_achievement',
    'skan_cost_per_unlock_achievement',
    'skan_unlock_achievement_rate',
    'skan_total_unlock_achievement',
    'skan_cost_per_total_unlock_achievement',
    'skan_total_unlock_achievement_value',
    // Generate Lead (SKAN)
    'skan_sales_lead',
    'skan_cost_per_sales_lead',
    'skan_sales_lead_rate',
    'skan_total_sales_lead',
    'skan_cost_per_total_sales_lead',
    'skan_total_sales_lead_value',
    // In-App Ad Click (SKAN)
    'skan_in_app_ad_click',
    'skan_cost_per_in_app_ad_click',
    'skan_in_app_ad_click_rate',
    'skan_total_in_app_ad_click',
    'skan_cost_per_total_in_app_ad_click',
    'skan_total_in_app_ad_click_value',
    // In-App Ad Impression (SKAN)
    'skan_in_app_ad_impr',
    'skan_cost_per_in_app_ad_impr',
    'skan_in_app_ad_impr_rate',
    'skan_total_in_app_ad_impr',
    'skan_cost_per_total_in_app_ad_impr',
    'skan_total_in_app_ad_impr_value',
    // Loan Apply (SKAN)
    'skan_loan_apply',
    'skan_cost_per_loan_apply',
    'skan_loan_apply_rate',
    'skan_total_loan_apply',
    'skan_cost_per_total_loan_apply',
    // Loan Approval (SKAN)
    'skan_loan_credit',
    'skan_cost_per_loan_credit',
    'skan_loan_credit_rate',
    'skan_total_loan_credit',
    'skan_cost_per_total_loan_credit',
    // Loan Disbursal (SKAN)
    'skan_loan_disbursement',
    'skan_cost_per_loan_disbursement',
    'skan_loan_disbursement_rate',
    'skan_total_loan_disbursement',
    'skan_cost_per_total_loan_disbursement',
    // Login (SKAN)
    'skan_login',
    'skan_cost_per_login',
    'skan_login_rate',
    'skan_total_login',
    'skan_cost_per_total_login',
    // Rate (SKAN)
    'skan_ratings',
    'skan_cost_per_ratings',
    'skan_ratings_rate',
    'skan_total_ratings',
    'skan_cost_per_total_ratings',
    'skan_total_ratings_value',
    // Search (SKAN)
    'skan_search',
    'skan_cost_per_search',
    'skan_search_rate',
    'skan_total_search',
    'skan_cost_per_total_search',
    // Start Trial (SKAN)
    'skan_start_trial',
    'skan_cost_per_start_trial',
    'skan_start_trial_rate',
    'skan_total_start_trial',
    'skan_cost_per_total_start_trial',
    // Subscribe (SKAN)
    'skan_subscribe',
    'skan_cost_per_subscribe',
    'skan_subscribe_rate',
    'skan_total_subscribe',
    'skan_cost_per_total_subscribe',
    'skan_total_subscribe_value',
    // Attribution metrics (SKAN)
    'skan_vta_conversion',
    'skan_cost_per_vta_conversion',
    'skan_vta_app_install',
    'skan_cost_per_vta_app_install',
    'skan_vta_registration',
    'skan_cost_per_vta_registration',
    'skan_vta_purchase',
    'skan_cost_per_vta_purchase',
    'skan_cta_conversion',
    'skan_cost_per_cta_conversion',
    'skan_cta_app_install',
    'skan_cost_per_cta_app_install',
    'skan_cta_registration',
    'skan_cost_per_cta_registration',
    'skan_cta_purchase',
    'skan_cost_per_cta_purchase',
  ];
  let metric = [];
  const dimensionJoin = dimension.join(', ');
  if (dimensionJoin === 'country_code') {
    metric = [...CONF.TIKTOK.METRICS_COUNTRY_CODE];
  } else if (dimensionJoin === 'advertiser_id, country_code') {
    metric = [...CONF.TIKTOK.METRICS_COUNTRY_CODE_ADACCOUNT];
    // metric.push('campaign_name', 'campaign_budget', 'split_test', 'campaign_dedicate_type');
  } else if (dimensionJoin === 'ad_type') {
    metric = [...CONF.TIKTOK.METRICS_AD_TYPE];
  } else if (dimensionJoin === 'advertiser_id, ad_type') {
    metric = [...CONF.TIKTOK.METRICS_AD_TYPE_ADACCOUNT];
  } else if (dimensionJoin === 'custom_event_type' || dimensionJoin === 'advertiser_id, custom_event_type') {
    metric = [...CONF.TIKTOK.METRICS_CUSTOM_EVENT_TYPE];
  } else if (dimensionJoin === 'image_id' || dimensionJoin === 'advertiser_id, image_id') {
    metric = [...CONF.TIKTOK.METRICS_IMAGE_ID];
  } else {
    metric = [...metricBasic];
  }
  // console.log('광고계정 metric =', metric);

  const datas = {
    advertiser_id: advertiserIds,
    service_type: 'AUCTION', // 광고 서비스 유형. 열거형 값: AUCTION(경매 광고), RESERVATION(예약 광고). 기본값: AUCTION.
    data_level: 'AUCTION_ADVERTISER', // ['AUCTION_ADVERTISER', 'RESERVATION_AD', 'RESERVATION_ADGROUP', 'AUCTION_ADGROUP', 'RESERVATION_CAMPAIGN', 'AUCTION_AD', 'AUCTION_CAMPAIGN', 'RESERVATION_ADVERTISER']
    report_type: 'BASIC', // Report type. Enum values: BASIC (basic report), AUDIENCE (audience report), PLAYABLE_MATERIAL (playable ads report), CATALOG (DSA report).

    dimensions: dimension,

    metrics: metric,

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
  // console.log('광고계정 인사이트 result =', result);

  if (result.data.message !== 'OK') {
    console.log('광고계정 ' + dimensionJoin + ' 인사이트 err =', result.data.message);
  } else {
    console.log('광고계정 ' + dimensionJoin + ' 인사이트 result page_info =', result.data.data.page_info);
    // console.log('광고계정 인사이트 result list =', result.data.data.list);
    console.log('광고계정 ' + dimensionJoin + ' 인사이트 result list.length =', result.data.data.list.length);

    const arr = result.data.data.list;
    for (let i = 1; i < result.data.data.page_info.total_page; i++) {
      console.log('page num =', i + 1);
      datas.page = i + 1;
      const result = await axios(config);
      arr.push(...result.data.data.list);
    }
    // console.log('arr =', arr);
    console.log('광고계정 페이징 처리후 결과 arr.length =', arr.length);

    const vad = await db.connection(CONFDB.DB.NAME);
    const userTiktok = vad.collection(CONFDB.DB.TIKTOK.COLLECTION);

    let breakdown = null;
    if (dimensionJoin !== 'advertiser_id') {
      breakdown = dimensionJoin;
    }
    console.log('광고계정 breakdown =', breakdown);

    const data = {
      userId,
      apiId: 'adAccounts',
      dataType: 'insight',
      adAccountId: advertiserIds,
      adAccountName: advertiserName,
      serviceType: 'AUCTION',
      reportType: 'BASIC', // report_type
      breakdowns: breakdown,
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
};
