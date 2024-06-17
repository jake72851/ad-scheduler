const config = {
  MEDIA: ['facebook', 'google', 'tiktok', 'kakao', 'naver'],

  KAKAO: {
    token_url: 'https://kauth.kakao.com/oauth/token',
    token_redirect_uri: 'http://localhost',

    API: 'https://apis.moment.kakao.com/openapi/v4/',
    API_ADACCOUNT: 'adAccounts/report',
    API_CAMPAIGN: 'campaigns/report',
    API_ADGROUP: 'adGroups/report',
    API_CREATIVES: 'creatives/report',
    API_CAMPAIGN_LIST: 'campaigns',
    API_ADGROUP_LIST: 'adGroups',
    API_CREATIVES_LIST: 'creatives',

    API_KEYWORD: 'https://api.keywordad.kakao.com/openapi/v1/',
    API_KEYWORD_CREATIVES_LIST: 'creatives/basic',
    API_KEYWORD_REPORT: 'keywords/report',

    DIMENSION: [
      // 보고서 조회 기준
      'none', // dimension이 없어야하는 경우처리
      'CREATIVE_FORMAT',
      'PLACEMENT',
      'AGE',
      'GENDER',
      'AGE_GENDER',
      'LOCATION',
      'DEVICE_TYPE',
      'HOUR',
    ],
    METRICS: [
      // 보고서 지표 그룹
      'BASIC',
      'ADDITION',
      'MESSAGE',
      'MESSAGE_ADDITION',
      'MESSAGE_CLICK',
      'PLUS_FRIEND',
      'PIXEL_SDK_CONVERSION',
      'SLIDE_CLICK',
      'VIDEO',
      'ADVIEW',
      'BIZ_BOARD',
      'SPB',
    ],

    DIMENSION_KEYWORD: [
      'none', // dimension이 없어야하는 경우처리
      'HOUR',
      'DEVICE',
      'PLACEMENT',
      'KEYWORD_EX',
      'ASSET_TYPE',
    ],
    METRICS_KEYWORD: [
      // 광고계정 보고서에서는 BASIC만 제공
      'BASIC',
      'ADDITION',
      'PIXEL_SDK_CONVERSION',
    ],
  },

  GOOGLE: {
    CLIENT_ID: '...',
    CLINET_SECRET: '...',
    DEVELOPER_TOKEN: '...',
    LOGIN_CUSTOMER_ID: '...',
    API: 'https://googleads.googleapis.com/v12/customers/',
    API_END: '/googleAds:search',
    GA4_ADMIN: 'https://analyticsadmin.googleapis.com/v1beta/',
    GA4_DATA: 'https://analyticsdata.googleapis.com/v1beta/',
    GA4_ACCOUNT_PROPERTIES: 'properties?filter=ancestor:accounts/',
    GA4_PROPERTIES: 'properties/',
    GA4_BATCH: ':batchRunReports',
    REDIRECT_URI: 'http://localhost:3000',

    GA4: {
      UTM_DIMENSIONS: ['medium', 'contentGroup', 'contentType'],
      UTM_METRICS_1: [
        { name: 'bounceRate' },
        { name: 'activeUsers' },
        { name: 'averagePurchaseRevenuePerUser' },
        { name: 'conversions' },
        { name: 'dauPerMau' },
        { name: 'dauPerWau' },
        { name: 'engagementRate' },
      ],
      UTM_METRICS_2: [
        { name: 'eventValue' },
        { name: 'firstTimePurchaserConversionRate' },
        { name: 'firstTimePurchasers' },
        { name: 'totalRevenue' },
        { name: 'totalUsers' },
      ],
      UTM_METRICS_3: [{ name: 'userConversionRate' }, { name: 'wauPerMau' }],

      AUDIENCE_DIMENSIONS: [
        'brandingInterest',
        'deviceCategory',
        'mobileDeviceBranding',
        'operatingSystem',
        'region',
        'userAgeBracket',
        'userGender',
      ],
      AUDIENCE_1: [
        { name: 'bounceRate' },
        { name: 'activeUsers' },
        { name: 'averagePurchaseRevenuePerUser' },
        { name: 'averageSessionDuration' },
        { name: 'conversions' },
        { name: 'dauPerMau' },
        { name: 'dauPerWau' },
        { name: 'ecommercePurchases' },
        { name: 'engagementRate' },
        { name: 'eventCount' },
      ],
      AUDIENCE_2: [
        { name: 'eventCountPerUser' },
        { name: 'eventValue' },
        { name: 'firstTimePurchaserConversionRate' },
        { name: 'firstTimePurchasers' },
        { name: 'firstTimePurchasersPerNewUser' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'screenPageViewsPerUser' },
        { name: 'totalRevenue' },
        { name: 'totalUsers' },
      ],
      AUDIENCE_3: [{ name: 'userConversionRate' }, { name: 'userEngagementDuration' }, { name: 'wauPerMau' }],

      TAKE_USER_DIMENSIONS: [
        'firstUserDefaultChannelGroup',
        'firstUserMedium',
        'firstUserSource',
        'firstUserSourceMedium',
        'firstUserSourcePlatform',
        'firstUserCampaignName',
        'firstUserGoogleAdsAdNetworkType',
        'firstUserGoogleAdsAdGroupName',
      ],
      TAKE_USER_1: [
        { name: 'newUsers' },
        { name: 'engagedSessions' },
        { name: 'engagementRate' },
        { name: 'engagedSessionsPerUser', expression: 'engagedSessions/totalUsers' },
        { name: 'userEngagementDurationPerUser', expression: 'userEngagementDuration/totalUsers' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],

      TAKE_TRAFFIC_DIMENSIONS: [
        'sessionDefaultChannelGroup',
        'sessionSourceMedium',
        'sessionMedium',
        'sessionSource',
        'sessionSourcePlatform',
        'sessionCampaignName',
      ],
      TAKE_TRAFFIC_1: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'engagedSessions' },
        { name: 'userEngagementDurationPerSession', expression: 'userEngagementDuration/sessions' },
        { name: 'engagedSessionsPerUser', expression: 'engagedSessions/totalUsers' },
        { name: 'eventsPerSession' },
        { name: 'engagementRate' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],

      JOIN_PAGE_SCREENS_DIMENSIONS: [
        'unifiedScreenClass',
        'unifiedPagePathScreen',
        'unifiedScreenName',
        'contentGroup',
      ],
      JOIN_PAGE_SCREENS_1: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'screenPageViewsPerUser' },
        { name: 'userEngagementDurationPerUser', expression: 'userEngagementDuration/totalUsers' },
        { name: 'eventCount' },
        { name: 'totalRevenue' },
        { name: 'conversions' },
      ],

      EVENT_NAME_1: [
        { name: 'eventCount' },
        { name: 'totalUsers' },
        { name: 'eventCountPerUser' },
        { name: 'totalRevenue' },
        { name: 'conversions' },
      ],

      PAGE_PATH_1: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'userEngagementDurationPerSession', expression: 'userEngagementDuration/sessions' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],

      ITEM_DIMENSIONS: ['itemName', 'itemBrand'],
      ITEM_1: [
        { name: 'itemsViewed' },
        { name: 'itemsAddedToCart' },
        { name: 'itemsPurchased' },
        { name: 'itemRevenue' },
      ],

      ITEM_PROMOTION_1: [
        { name: 'itemsViewedInPromotion' },
        { name: 'itemsClickedInPromotion' },
        { name: 'itemPromotionClickThroughRate' },
        { name: 'itemsAddedToCart' },
        { name: 'itemsCheckedOut' },
        { name: 'itemsPurchased' },
        { name: 'itemsViewed' },
        // { name: 'promotionClicks' },
        // { name: 'promotionViews' },
      ],

      COMMON_1: [
        { name: 'newUsers' },
        { name: 'engagedSessions' },
        { name: 'engagementRate' },
        { name: 'userEngagementDuration' },
        { name: 'eventCount' },
      ],

      EVENT_NAME_2: [
        { name: 'eventCount' },
        { name: 'eventCountPerUser' },
        { name: 'eventValue' },
        { name: 'eventsPerSession' },
        { name: 'totalRevenue' },
        { name: 'totalUsers' },
        { name: 'conversions' },
      ],
    },
  },

  FACEBOOK: {
    FB_APP_ID: '...',
    FB_APP_SECRET: '...',
    FB_DEV_ACCOUNT_ID: '...',
    FB_ACCOUNT_ID: '...',
    FB_BUSINESS_ID: '...',
    FB_VAD_DEV_USER_ID: '...',
    ACCESS_TOKEN:
      '...',
    API: 'https://graph.facebook.com/v16.0/',

    FIELDS: [
      // 공통
      'account_id',
      'account_name',
      'action_values',
      'actions',

      // ad용 지표
      'ad_id',
      'ad_name',
      'adset_id',
      'adset_name',
      'attribution_setting', // adAccount, campaign 정보 안나옴

      'campaign_id', // adAccount 정보 안나옴

      'conversion_values', // adAccount, campaign, adSet, ad 정보 안나옴
      'conversions', // adAccount, campaign, adSet, ad 정보 안나옴
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
    ],

    // https://developers.facebook.com/docs/marketing-api/insights/breakdowns
    BREAKDOWN: [
      'age',
      'gender',
      'age, gender',
      'place_page_id', // 비즈니스 위치 (페이스북 문서 : 노출 또는 클릭과 관련된 장소 페이지의 ID)
      'country',
      'region', // 지역
      'dma', // DMA 지역
      'impression_device', // 노출 기기 (페이스북 문서 : Meta 사용자에게 마지막 광고가 게재된 기기입니다. 예를 들어 사용자가 iPhone에서 광고를 본 경우 \"iPhone\"이 됩니다)

      // 'creative_media_type', // 미디어 유형 : 페이스북 관리자용
      'image_asset, video_asset', // 미디어 유형 추측
      'image_asset',
      'video_asset',

      'publisher_platform', // 광고가 게재된 플랫폼(예: Facebook, Instagram 또는 Audience Network)입니다
      'publisher_platform, impression_device',
      'user_segment_key', // 타겟 유형 (페이스북 문서 : 어드밴티지+ 쇼핑 캠페인(ASC)의 사용자 세그먼트(예: 신규, 기존)입니다. 기존 사용자는 ASC 설정의 맞춤 타겟을 통해 지정)
      'user_segment_key, country',
      'publisher_platform, platform_position, device_platform', // 노출 위치
      'publisher_platform, platform_position, device_platform, impression_device', // 노출 위치 및 기기
      'product_id', // 제품 ID
      'hourly_stats_aggregated_by_advertiser_time_zone', // 시간(광고 계정 시간대)
      'hourly_stats_aggregated_by_audience_time_zone', // 시간(조회한 사람의 시간대)
    ],
    ACTION_BREAKDOWN: [
      'action_device, action_type', // 전환 기기
      'action_reaction, action_type', // 게시물 공감 유형
      'action_destination, action_target_id, action_type', // 랜딩 페이지
      'action_video_type, action_type', // 동영상 조회 유형
      'action_video_sound, action_type', // 동영상 소리
      'action_carousel_card_id, action_carousel_card_name, action_type', // 슬라이드
      'action_canvas_component_name, action_type', // 인스턴트 경험 구성 요소
      // 'action_brand_name, action_type', // 브랜드 - 페이스북 문서에는 없음
      // 'action_category_name, action_type', // 카테고리 - 페이스북 문서에는 없음
    ],
    DYNAMIC_BREAKDOWN: [
      'image_asset, video_asset, action_carousel_card_id, action_carousel_card_name', // 이미지, 동영상, 슬라이드쇼
      'image_asset, action_carousel_card_id, action_carousel_card_name', // 이미지, 동영상, 슬라이드쇼
      'video_asset, action_carousel_card_id, action_carousel_card_name', // 이미지, 동영상, 슬라이드쇼

      'link_url_asset', // 웹사이트 URL
      'body_asset', // 텍스트
      'title_asset', // 제목(광고 설정)
      'description_asset', // 설명
      'call_to_action_asset', // 행동 유도
    ],
    BREAKDOWN_AND_ACTION_BREAKDOWN: [
      { break: 'age', action: 'action_destination, action_target_id, action_type' }, // 0 랜딩 페이지
      { break: 'age', action: 'action_video_type, action_type' }, // 1 동영상 조회 유형
      { break: 'age', action: 'action_carousel_card_id, action_carousel_card_name, action_type' }, // 2 슬라이드

      { break: 'gender', action: 'action_destination, action_target_id, action_type' }, // 3 랜딩 페이지
      { break: 'gender', action: 'action_video_type, action_type' }, // 4 동영상 조회 유형
      { break: 'gender', action: 'action_carousel_card_id, action_carousel_card_name, action_type' }, // 5 슬라이드

      { break: 'age, gender', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'age, gender', action: 'action_video_type, action_type' }, // 동영상 조회 유형
      { break: 'age, gender', action: 'action_carousel_card_id, action_carousel_card_name, action_type' }, // 슬라이드

      // place_page_id : 비즈니스 위치는 브랜드, 카테고리만 있어서 현재는 불가능

      { break: 'country', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'country', action: 'action_video_type, action_type' }, // 동영상 조회 유형
      { break: 'country', action: 'action_carousel_card_id, action_carousel_card_name, action_type' }, // 슬라이드

      { break: 'region', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'region', action: 'action_video_type, action_type' }, // 동영상 조회 유형

      { break: 'dma', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'dma', action: 'action_video_type, action_type' }, // 동영상 조회 유형

      { break: 'impression_device', action: 'action_device, action_type' }, // 전환 기기
      { break: 'impression_device', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'impression_device', action: 'action_video_type, action_type' }, // 동영상 조회 유형
      { break: 'impression_device', action: 'action_carousel_card_id, action_carousel_card_name, action_type' }, // 슬라이드

      // creative_media_type('image_asset, video_asset') : 미디어 유형은 브랜드, 카테고리만 있어서 현재는 불가능

      { break: 'publisher_platform', action: 'action_device, action_type' }, // 전환 기기
      { break: 'publisher_platform', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'publisher_platform', action: 'action_video_type, action_type' }, // 동영상 조회 유형
      { break: 'publisher_platform', action: 'action_carousel_card_id, action_carousel_card_name, action_type' }, // 슬라이드

      { break: 'publisher_platform, impression_device', action: 'action_device, action_type' }, // 전환 기기
      { break: 'publisher_platform, impression_device', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'publisher_platform, impression_device', action: 'action_video_type, action_type' }, // 동영상 조회 유형
      {
        break: 'publisher_platform, impression_device',
        action: 'action_carousel_card_id, action_carousel_card_name, action_type',
      }, // 슬라이드

      // user_segment_key : 타겟 유형은 없음
      // user_segment_key, country : 타겟 유형 및 국가는 없음

      { break: 'publisher_platform, platform_position, device_platform', action: 'action_device, action_type' }, // 전환 기기
      {
        break: 'publisher_platform, platform_position, device_platform',
        action: 'action_destination, action_target_id, action_type',
      }, // 랜딩 페이지
      { break: 'publisher_platform, platform_position, device_platform', action: 'action_video_type, action_type' }, // 동영상 조회 유형
      {
        break: 'publisher_platform, platform_position, device_platform',
        action: 'action_carousel_card_id, action_carousel_card_name, action_type',
      }, // 슬라이드

      {
        break: 'publisher_platform, platform_position, device_platform, impression_device',
        action: 'action_device, action_type',
      }, // 전환 기기
      {
        break: 'publisher_platform, platform_position, device_platform, impression_device',
        action: 'action_destination, action_target_id, action_type',
      }, // 랜딩 페이지
      {
        break: 'publisher_platform, platform_position, device_platform, impression_device',
        action: 'action_video_type, action_type',
      }, // 동영상 조회 유형
      {
        break: 'publisher_platform, platform_position, device_platform, impression_device',
        action: 'action_carousel_card_id, action_carousel_card_name, action_type',
      }, // 슬라이드

      { break: 'product_id', action: 'action_destination, action_target_id, action_type' }, // 랜딩 페이지
      { break: 'product_id', action: 'action_video_type, action_type' }, // 동영상 조회 유형

      // hourly_stats_aggregated_by_advertiser_time_zone : 시간(광고 계정 시간대)은 브랜드, 카테고리만 있어서 현재는 불가능
      // hourly_stats_aggregated_by_audience_time_zone :  시간(조회한 사람의 시간대)은 브랜드, 카테고리만 있어서 현재는 불가능
    ],
    BREAKDOWN_AND_DYNAMIC_BREAKDOWN: [
      { break: 'age', dynamic: 'link_url_asset' }, // 웹사이트 URL
      { break: 'age', dynamic: 'body_asset' }, // 텍스트
      { break: 'age', dynamic: 'title_asset' }, // 제목(광고 설정)
      { break: 'age', dynamic: 'description_asset' }, // 설명
      { break: 'age', dynamic: 'call_to_action_asset' }, // 행동 유도

      { break: 'gender', dynamic: 'link_url_asset' }, // 웹사이트 URL
      { break: 'gender', dynamic: 'body_asset' }, // 텍스트
      { break: 'gender', dynamic: 'title_asset' }, // 제목(광고 설정)
      { break: 'gender', dynamic: 'description_asset' }, // 설명
      { break: 'gender', dynamic: 'call_to_action_asset' }, // 행동 유도

      { break: 'age, gender', dynamic: 'link_url_asset' }, // 웹사이트 URL
      { break: 'age, gender', dynamic: 'body_asset' }, // 텍스트
      { break: 'age, gender', dynamic: 'title_asset' }, // 제목(광고 설정)
      { break: 'age, gender', dynamic: 'description_asset' }, // 설명
      { break: 'age, gender', dynamic: 'call_to_action_asset' }, // 행동 유도

      // place_page_id : 비즈니스 위치는 없음
      // country : 국가는 없음
      // region : 지역는 없음
      // dma : DMA 지역는 없음
      // impression_device : 노출 기기는 없음
      // creative_media_type('image_asset, video_asset') : 미디어 유형는 없음
      // publisher_platform : 플랫폼는 없음
      // publisher_platform, impression_device : 플랫폼 및 기기는 없음
      // user_segment_key : 타겟 유형은 없음
      // user_segment_key, country : 타겟 유형 및 국가는 없음
      // publisher_platform, platform_position, device_platform : 노출 위치는 없음
      // publisher_platform, platform_position, device_platform, impression_device : 노출 위치 및 기기는 없음
      // 'product_id' : 제품 ID는 없음
      // 'hourly_stats_aggregated_by_advertiser_time_zone' : 시간(광고 계정 시간대)는 없음
      // 'hourly_stats_aggregated_by_audience_time_zone' : 시간(조회한 사람의 시간대)는 없음
    ],
    RESULT_MAPPING: {
      // objectives / optimization_goal / action_type 순서
      APP_INSTALLS: {
        APP_INSTALLS: {
          type: 'actions',
          name: 'mobile_app_install', // omni_app_install
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impression',
        },
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
        VALUE: {
          type: 'actions',
          name: '',
        },
      },
      BRAND_AWARENESS: {
        AD_RECALL_LIFT: {
          type: 'actions',
          name: '',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
      },
      CONVERSIONS: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: /offsite_conversion/, // ["offsite_conversion.fb_pixel_initiate_checkout", "offsite_conversion.fb_pixel_add_to_cart", "offsite_conversion.fb_pixel_purchase", "offsite_conversion.fb_pixel_custom", "offsite_conversion.fb_pixel_lead"]
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
        VALUE: {
          type: 'actions',
          name: '',
        },
        LANDING_PAGE_VIEWS: {
          type: 'actions',
          name: '',
        },
        CONVERSATIONS: {
          type: 'actions',
          name: '',
        },
      },
      EVENT_RESPONSES: {
        EVENT_RESPONSES: {
          type: 'insights',
          name: '',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
      },
      LEAD_GENERATION: {
        LEAD_GENERATION: {
          type: 'actions',
          name: 'onsite_conversion.lead_grouped', // leadgen_grouped
        },
        QUALITY_LEAD: {
          type: 'actions',
          name: '',
        },
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
        QUALITY_CALL: {
          type: 'actions',
          name: '',
        },
      },
      LINK_CLICKS: {
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
        LANDING_PAGE_VIEWS: {
          type: 'actions',
          name: 'landing_page_view',
        },
        APP_INSTALLS: {
          type: 'actions',
          name: 'mobile_app_install',
        },
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
      },
      MESSAGES: {
        CONVERSATIONS: {
          type: 'actions',
          name: '',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        LEAD_GENERATION: {
          type: 'actions',
          name: '',
        },
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
      },
      PAGE_LIKES: {
        PAGE_LIKES: {
          type: 'actions',
          name: '',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
      },
      POST_ENGAGEMENT: {
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
      },
      PRODUCT_CATALOG_SALES: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
        LINK_CLICKS: {
          type: 'actions',
          name: 'link_click',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
        POST_ENGAGEMENT: {
          type: 'actions',
          name: 'post_engagement',
        },
        REACH: {
          type: 'insights',
          name: 'reach',
        },
        CONVERSATIONS: {
          type: 'actions',
          name: '',
        },
        VALUE: {
          type: 'actions',
          name: '',
        },
      },
      REACH: {
        REACH: {
          type: 'insights',
          name: 'reach',
        },
        IMPRESSIONS: {
          type: 'insights',
          name: 'impressions',
        },
      },
      VIDEO_VIEWS: {
        THRUPLAY: {
          type: 'actions',
          name: 'video_view',
        },
      },
      OUTCOME_APP_PROMOTION: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
      },
      OUTCOME_AWARENESS: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
      },
      OUTCOME_ENGAGEMENT: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
      },
      OUTCOME_LEADS: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: /offsite_conversion/, // ["offsite_conversion.fb_pixel_lead", "offsite_conversion.fb_pixel_view_content","offsite_conversion.fb_pixel_complete_registration", "lick_to_call_call_confirm", "offsite_conversion.fb_pixel_purchase", "offsite_conversion.fb_pixel_add_to_cart"]
        },
        LEAD_GENERATION: {
          type: 'actions',
          name: 'onsite_conversion.lead_grouped',
        },
        QUALITY_CALL: {
          type: 'actions',
          name: 'click_to_call_call_confirm',
        },
      },
      OUTCOME_SALES: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: 'offsite_conversion.fb_pixel_initiate_checkout',
        },
      },
      OUTCOME_TRAFFIC: {
        OFFSITE_CONVERSIONS: {
          type: 'actions',
          name: '',
        },
      },
    },
    RESULT_MAPPING_OPTIMIZATION: {
      APP_INSTALLS: {
        type: 'actions',
        name: 'mobile_app_install', // omni_app_install
      },
      IMPRESSIONS: {
        type: 'insights',
        name: 'impression',
      },
      POST_ENGAGEMENT: {
        type: 'actions',
        name: 'post_engagement',
      },
      // OFFSITE_CONVERSIONS: {
      //   type: 'actions',
      //   name: '',
      // },
      LINK_CLICKS: {
        type: 'actions',
        name: 'link_click',
      },
      REACH: {
        type: 'insights',
        name: 'reach',
      },
      LEAD_GENERATION: {
        type: 'actions',
        name: 'onsite_conversion.lead_grouped', // leadgen_grouped
      },
      LANDING_PAGE_VIEWS: {
        type: 'actions',
        name: 'landing_page_view',
      },
      THRUPLAY: {
        type: 'actions',
        name: 'video_view',
      },
      QUALITY_CALL: {
        type: 'actions',
        name: 'click_to_call_call_confirm',
      },
    },
  },

  NAVER: {
    CUSTOMER_ID: '1887997',
    API_KEY: '010000000030d002f3161ee70aa54ec59dfa210251aeffabf570520802d5e1a6e21f34c9f3',
    API_SECRET: 'AQAAAAAw0ALzFh7nCqVOxZ36IQJR6fGGHKlLY5Lq+QLfYtL8WQ==',
    API: 'https://api.searchad.naver.com',
    FIELDS: [
      'impCnt',
      'clkCnt',
      'salesAmt',
      'ctr',
      'cpc',
      'avgRnk',
      'ccnt',
      'pcNxAvgRnk',
      'mblNxAvgRnk',
      'crto',
      'convAmt',
      'ror',
      'cpConv',
      'viewCnt',
    ],
    BREAKDOWN: [
      'null', // 기본 null 처리
      'pcMblTp',
      'dayw',
      'hh24',
      'regnNo',
    ],
  },

  TIKTOK: {
    SECRET: '...',
    APP_ID: '...',
    ACCESS_TOKEN: '...',

    API: 'https://business-api.tiktok.com/open_api/v1.3',
    API_ADACCOUNT_INFO: '/advertiser/info/',
    API_CAMPAIGN: '/campaign/get/',
    API_INSIGHT: '/report/integrated/get/',
    API_REGION: '/tool/region/',
    API_LANGUAGE: '/tool/language/',
    API_CATEGORY: '/tool/interest_category/',
    API_REQUESTPAGESIZE: 1000,

    REGION_OBJECT_TYPE: [
      // 지원하는 항목 여러개이지만 총 데이터 갯수는 동일한것으로 보임
      'REACH',
      // 'TRAFFIC',
      // 'VIDEO_VIEWS',
      // 'LEAD_GENERATION',
      // 'ENGAGEMENT',
      // 'APP_INSTALL', // To be deprecated
      // 'CONVERSIONS', // To be deprecated
      // 'APP_PROMOTION',
      // 'WEB_CONVERSIONS',
      // 'PRODUCT_SALES',
    ],

    DIMENSION_BASIC: [
      // dimension 처리시 광고level별 대체해서 처리하기 위해 AD_LEVEL 추가
      ['AD_LEVEL'],
      // Targeting
      ['country_code'],
      ['AD_LEVEL', 'country_code'],
      ['ad_type'],
      ['AD_LEVEL', 'ad_type'],
      // Asset
      ['custom_event_type'],
      ['AD_LEVEL', 'custom_event_type'],
      ['image_id'],
      ['AD_LEVEL', 'image_id'],
    ],
    DIMENSION_AUDIENCE: [
      // dimension 처리시 audience dimension 하나는 꼭 들어가야함
      ['gender'],
      ['age'],
      ['age', 'gender'],
      ['country_code'],
      ['province_id'],
      ['dma_id'],
      ['ac'],
      ['language'],
      ['platform'],
      ['interest_category'],
      ['behavior_id'],
      ['placement'],
      ['device_brand_id'],
      ['contextual_tag'],
    ],
    DIMENSION_DSA: [['catalog_id'], ['product_set_id'], ['product_id'], ['sku_id']],
    DIMENSION_PLAYABLE: [
      ['playable_id'],
      // ['country_code'], // 독립사용 안됨
      ['playable_id', 'country_code'],
    ],
    DIMENSION_RESERVATION: [
      // dimension 처리시 광고level별 대체해서 처리하기 위해 AD_LEVEL 추가
      ['AD_LEVEL'],
      ['country_code'],
      ['AD_LEVEL', 'country_code'],
    ],

    METRICS_COUNTRY_CODE: [
      // Basic data metrics >
      'spend',
      'cpc',
      'cpm',
      'impressions',
      'gross_impressions',
      'clicks',
      'ctr',
      'reach',
      'conversion',
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      'real_time_conversion',
      'real_time_cost_per_conversion',
      'real_time_conversion_rate',
      'result', // 광고계정, 캠페인 지원안함
      'cost_per_result', // 광고계정, 캠페인 지원안함
      'result_rate', // 광고계정, 캠페인 지원안함
      'real_time_result', // 광고계정, 캠페인 지원안함
      'real_time_cost_per_result', // 광고계정, 캠페인 지원안함
      'real_time_result_rate', // 광고계정, 캠페인 지원안함
      'frequency',

      // Video play metrics >
      'video_play_actions',
      'video_watched_2s',
      'video_watched_6s',
      'average_video_play',
      'video_views_p25',
      'video_views_p50',
      'video_views_p75',
      'video_views_p100',
      'engaged_view',
      'engaged_view_15s',

      // Engagement metrics >
      'profile_visits', // This metric is only for Spark Ads.
      'profile_visits_rate', // This metric is only for Spark Ads.
      'likes',
      'comments',
      'shares',
      'follows',
      'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.

      // LIVE metrics >
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
      // Purchase
      'purchase',
      'cost_per_purchase',
      'purchase_rate',

      // Page event metrics >
      // Complete Payment
      'complete_payment',
      'cost_per_complete_payment',
      'complete_payment_rate',
      // Landing Page View
      'total_landing_page_view',
      'cost_per_landing_page_view',
      'landing_page_view_rate',
      // Page View (to be deprecated)
      'page_browse_view',
      'cost_per_page_browse_view',
      'page_browse_view_rate',
      // Click Button
      'button_click',
      'cost_per_button_click',
      'button_click_rate',
      // Contact
      'online_consult',
      'cost_per_online_consult',
      'online_consult_rate',
      // Submit Form
      'form',
      'cost_per_form',
      'form_rate',
      // Download
      'download_start',
      'cost_per_download_start',
      'download_start_rate',
    ],
    METRICS_COUNTRY_CODE_ADACCOUNT: [
      // Basic data metrics >
      'spend',
      'cpc',
      'cpm',
      'impressions',
      'gross_impressions',
      'clicks',
      'ctr',
      'reach',
      'conversion',
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      'real_time_conversion',
      'real_time_cost_per_conversion',
      'real_time_conversion_rate',
      'result', // 광고계정, 캠페인 지원안함
      'cost_per_result', // 광고계정, 캠페인 지원안함
      'result_rate', // 광고계정, 캠페인 지원안함
      'real_time_result', // 광고계정, 캠페인 지원안함
      'real_time_cost_per_result', // 광고계정, 캠페인 지원안함
      'real_time_result_rate', // 광고계정, 캠페인 지원안함
      'frequency',

      // Video play metrics >
      'video_play_actions',
      'video_watched_2s',
      'video_watched_6s',
      'average_video_play',
      'video_views_p25',
      'video_views_p50',
      'video_views_p75',
      'video_views_p100',
      'engaged_view',
      'engaged_view_15s',

      // Engagement metrics >
      'profile_visits', // This metric is only for Spark Ads.
      'profile_visits_rate', // This metric is only for Spark Ads.
      'likes',
      'comments',
      'shares',
      'follows',
      'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.

      // LIVE metrics >
      // 'live_product_clicks', // 광고계정 지원안함

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
      // Purchase
      'purchase',
      'cost_per_purchase',
      'purchase_rate',

      // Page event metrics >
      // Complete Payment
      // 'complete_payment',
      // 'cost_per_complete_payment',
      // 'complete_payment_rate',
      // Landing Page View
      'total_landing_page_view',
      'cost_per_landing_page_view',
      'landing_page_view_rate',
      // // Page View (to be deprecated)
      // 'page_browse_view',
      // 'cost_per_page_browse_view',
      // 'page_browse_view_rate',
      // // Click Button
      // 'button_click',
      // 'cost_per_button_click',
      // 'button_click_rate',
      // // Contact
      // 'online_consult',
      // 'cost_per_online_consult',
      // 'online_consult_rate',
      // // Submit Form
      // 'form',
      // 'cost_per_form',
      // 'form_rate',
      // // Download
      // 'download_start',
      // 'cost_per_download_start',
      // 'download_start_rate',
    ],
    METRICS_AD_TYPE: [
      // Basic data metrics >
      'spend',
      'cpc',
      'cpm',
      'impressions',
      'gross_impressions',
      'clicks',
      'ctr',
      'conversion',
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      'real_time_conversion',
      'real_time_cost_per_conversion',
      'real_time_conversion_rate',
      'result', // 광고계정, 캠페인 지원안함
      'cost_per_result', // 광고계정, 캠페인 지원안함
      'result_rate', // 광고계정, 캠페인 지원안함
      'real_time_result', // 광고계정, 캠페인 지원안함
      'real_time_cost_per_result', // 광고계정, 캠페인 지원안함
      'real_time_result_rate', // 광고계정, 캠페인 지원안함

      // Video play metrics >
      'video_play_actions',
      'video_watched_2s',
      'video_watched_6s',
      'average_video_play',
      'video_views_p25',
      'video_views_p50',
      'video_views_p75',
      'video_views_p100',
      'engaged_view',
      'engaged_view_15s',

      // Engagement metrics >
      'profile_visits', // This metric is only for Spark Ads.
      'profile_visits_rate', // This metric is only for Spark Ads.
      'likes',
      'comments',
      'shares',
      'follows',
      'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.

      // Page event metrics >
      // Landing Page View
      'total_landing_page_view',
      'cost_per_landing_page_view',
      'landing_page_view_rate',

      // Basic data metrics (SKAN)
      'skan_conversion',
      'skan_cost_per_conversion',
      'skan_conversion_rate',

      // In-App Event metrics (SKAN)
      // App Install (SKAN)
      'skan_app_install',
      'skan_cost_per_app_install',
      // App Installs (SKAN Privacy Withheld)
      'skan_app_install_withheld',
    ],
    METRICS_AD_TYPE_ADACCOUNT: [
      // Basic data metrics >
      'spend',
      'cpc',
      'cpm',
      'impressions',
      'gross_impressions',
      'clicks',
      'ctr',
      'conversion',
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      // 'real_time_conversion',
      // 'real_time_cost_per_conversion',
      // 'real_time_conversion_rate',
      'result', // 광고계정, 캠페인 지원안함
      'cost_per_result', // 광고계정, 캠페인 지원안함
      'result_rate', // 광고계정, 캠페인 지원안함
      'real_time_result', // 광고계정, 캠페인 지원안함
      'real_time_cost_per_result', // 광고계정, 캠페인 지원안함
      'real_time_result_rate', // 광고계정, 캠페인 지원안함

      // Video play metrics >
      'video_play_actions',
      'video_watched_2s',
      'video_watched_6s',
      'average_video_play',
      'video_views_p25',
      'video_views_p50',
      'video_views_p75',
      'video_views_p100',
      'engaged_view',
      'engaged_view_15s',

      // Engagement metrics >
      'profile_visits', // This metric is only for Spark Ads.
      'profile_visits_rate', // This metric is only for Spark Ads.
      'likes',
      'comments',
      'shares',
      'follows',
      'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.

      // Page event metrics >
      // Landing Page View
      'total_landing_page_view',
      'cost_per_landing_page_view',
      'landing_page_view_rate',

      // Basic data metrics (SKAN)
      'skan_conversion',
      'skan_cost_per_conversion',
      'skan_conversion_rate',

      // In-App Event metrics (SKAN)
      // App Install (SKAN)
      'skan_app_install',
      'skan_cost_per_app_install',
      // App Installs (SKAN Privacy Withheld)
      'skan_app_install_withheld',
    ],
    METRICS_CUSTOM_EVENT_TYPE: [
      // Basic data metrics >
      'clicks',

      // In-App Event metrics >
      // Custom App Event
      'unique_custom_app_events',
      'cost_per_unique_custom_app_event',
      'custom_app_event_rate',
      'custom_app_events',
      'cost_per_custom_app_event',
      'value_per_custom_app_event',
      'custom_app_events_value',

      // Page event metrics >
      // Custom Page Event
      'custom_page_events',
      'cost_per_custom_page_event',
      'custom_page_event_rate',
      'value_per_custom_page_event',
      'custom_page_events_value',
    ],
    METRICS_IMAGE_ID: ['clicks', 'single_image_impressions', 'single_image_impression_rate', 'single_image_ctr'],

    TEST_ADVERTISER_ID: '7154256566110208001',
  },
};

module.exports = config;
