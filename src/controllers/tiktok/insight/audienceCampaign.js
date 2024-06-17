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
    // 'stat_time_hour',

    // Audience dimensions > dimensionAdd pram으로 대치
    // 'gender',
    // 'age',
    // 'country_code',
    // 'province_id',
    // 'dma_id',
    // 'ac',
    // 'language',
    // 'platform',
    // 'interest_category',
    // 'interest_category_tier2',
    // 'interest_category_tier3',
    // 'interest_category_tier4',
    // 'behavior_id',
    // 'placement',
    // 'device_brand_id',
    // 'contextual_tag',
  ];

  const datas = {
    advertiser_id: advertiserIds,
    service_type: 'AUCTION', // 광고 서비스 유형. 열거형 값: AUCTION(경매 광고), RESERVATION(예약 광고). 기본값: AUCTION.
    data_level: 'AUCTION_CAMPAIGN', // ['AUCTION_ADVERTISER', 'RESERVATION_AD', 'RESERVATION_ADGROUP', 'AUCTION_ADGROUP', 'RESERVATION_CAMPAIGN', 'AUCTION_AD', 'AUCTION_CAMPAIGN', 'RESERVATION_ADVERTISER']
    report_type: 'AUDIENCE', // Report type. Enum values: BASIC (basic report), AUDIENCE (audience report), PLAYABLE_MATERIAL (playable ads report), CATALOG (DSA report).

    dimensions: [...dimension, ...dimensionAdd],

    metrics: [
      // Attribute metrics >
      'campaign_name',
      // 'campaign_id', // Supported at Ad Group and Ad level.
      'objective_type',
      'split_test',
      'campaign_budget',
      'campaign_dedicate_type',
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
      // 'device_brand_name', // Available when the device_brand_id dimension is used.
      // 'behavior_name', // Available when the behavior_id dimension is used.
      // 'action_category', // Available only when the behavior_id dimension is used. This metric does not support asynchronous reports.
      // 'action_scene', // Available only when the behavior_id dimension is used. This metric does not support asynchronous reports.
      // 'user_action', // For the VIDEO_RELATED scene, available values include WATCHED_TO_END, LIKED, COMMENTED, and SHARED. For the CREATOR_RELATED scene, available values are FOLLOWING and VIEW_HOMEPAGE
      // 'action_period', // This metric does not support asynchronous reports.
      'rf_campaign_type',

      // Basic data metrics >
      'spend',
      'cpc',
      'cpm',
      'impressions',
      'gross_impressions',
      'clicks',
      'ctr',
      // 'conversion', // this statistic is not supported for campaigns
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      'real_time_conversion',
      'real_time_cost_per_conversion',
      'real_time_conversion_rate',
      'result', // this statistic is not supported for campaigns
      'cost_per_result', // this statistic is not supported for campaigns
      'result_rate', // this statistic is not supported for campaigns
      'real_time_result', // this statistic is not supported for campaigns
      'real_time_cost_per_result', // this statistic is not supported for campaigns
      'real_time_result_rate', // this statistic is not supported for campaigns
      'currency',
      // 'is_aco', // Supported at AUCTION_ADGROUP level.
      // 'is_smart_creative', // Supported at AUCTION_AD level.

      // Video play metrics >
      'video_play_actions',
      'video_watched_2s',
      'video_watched_6s',
      'average_video_play',
      // 'average_video_play_per_user', // This metric is supported only when placement is specified in the dimensions field of the request.
      'video_views_p25',
      'video_views_p50',
      'video_views_p75',
      'video_views_p100',

      // Engagement metrics >
      // 'profile_visits', // This metric is only for Spark Ads.
      // 'profile_visits_rate', // This metric is only for Spark Ads.
      'likes',
      'comments',
      'shares',
      'follows',
      'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.
      // 'ix_page_duration_avg', // This metric is supported only when placement is specified in the dimensions field of the request.
      // 'ix_page_viewrate_avg', // This metric is supported only when placement is specified in the dimensions field of the request.

      // Page event metrics >
      // Landing Page View
      'total_landing_page_view',
      'cost_per_landing_page_view',
      'landing_page_view_rate',

      // ETC > Please query UV metrics without audience dimensions or audience dimensions without UV metrics in asynchronous reports instead
      // 'frequency',
      // 'cost_per_1000_reached',
      // 'reach',
      // 'live_play_count',
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
  console.log('캠페인 AUDIENCE 인사이트 datas.dimensions =', datas.dimensions);

  const dimensionAddJoin = dimensionAdd.join(', ');

  // behavior_name, action_category, action_scene은 dimension에 behavior_id가 있는 경우에만 가능
  // 나머지 else if도 같은 맥락
  if (dimensionAddJoin === 'behavior_id') {
    datas.metrics.push('behavior_name', 'action_category', 'action_scene');
  } else if (dimensionAddJoin === 'placement') {
    datas.metrics.push('average_video_play_per_user', 'ix_page_duration_avg', 'ix_page_viewrate_avg');
  } else if (dimensionAddJoin === 'device_brand_id') {
    datas.metrics.push('device_brand_name');
  }

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
  // console.log('캠페인 AUDIENCE 인사이트 result =', result);

  if (result.data.message !== 'OK') {
    console.log('캠페인 AUDIENCE ' + dimensionAddJoin + ' 인사이트 err =', result.data.message);
  } else {
    console.log('캠페인 AUDIENCE ' + dimensionAddJoin + ' 인사이트 result page_info =', result.data.data.page_info);
    // console.log('캠페인 AUDIENCE ' + dimensionAddJoin + ' 인사이트 result list =', result.data.data.list);
    console.log('캠페인 AUDIENCE ' + dimensionAddJoin + ' 인사이트 result list.length =', result.data.data.list.length);

    const arr = result.data.data.list;
    for (let i = 1; i < result.data.data.page_info.total_page; i++) {
      console.log('page num =', i + 1);
      datas.page = i + 1;
      const result = await axios(config);
      arr.push(...result.data.data.list);
    }
    // console.log('arr =', arr);
    console.log(dimensionAddJoin, ' arr.length =', arr.length);

    const vad = await db.connection(CONFDB.DB.NAME);
    const region = vad.collection(CONFDB.DB.TIKTOK.REGION);
    const language = vad.collection(CONFDB.DB.TIKTOK.LANGUAGE);
    const category = vad.collection(CONFDB.DB.TIKTOK.CATEGORY);

    // DMA and metropolitans are at the province level
    if (dimensionAddJoin === 'province_id' || dimensionAddJoin === 'dma_id') {
      for (const item of arr) {
        // console.log('province_id/dma_id item =', item);
        let location;
        if (dimensionAddJoin === 'province_id') {
          location = item.dimensions.province_id;
        } else {
          location = item.dimensions.dma_id;
        }

        // dma_id가 0인 경우는 해당 위치가 미국의 대도시권(DMA)에 속하지 않음을 의미 > 매칭 정보가 없으므로 처리안함
        if (location !== '0') {
          const foundData = await region.findOne({ locationId: location, level: 'PROVINCE' });
          // const foundData = CONF.TIKTOK.PROVINCES.find((d) => d.id === Number(item.dimensions.province_id));
          // console.log('province_id/dma_id foundData =', foundData);
          if (dimensionAddJoin === 'province_id') {
            item.dimensions.province_name = foundData.name;
            item.dimensions.province_regionCode = foundData.regionCode;
            item.dimensions.province_parentId = foundData.parentId;
          } else {
            item.dimensions.dma_name = foundData.name;
            item.dimensions.dma_regionCode = foundData.regionCode;
            item.dimensions.dma_parentId = foundData.parentId;
          }
        }
      }
    } else if (dimensionAddJoin === 'country_code') {
      for (const item of arr) {
        // console.log('country_code item =', item);
        // country_code 가 None인 경우는 해당 위치가 미국의 대도시권(DMA)에 속하지 않음을 의미 > 매칭 정보가 없으므로 처리안함
        if (item.dimensions.country_code !== 'None') {
          const foundData = await region.findOne({ regionCode: item.dimensions.country_code, level: 'COUNTRY' });
          // const foundData = CONF.TIKTOK.PROVINCES.find((d) => d.id === Number(item.dimensions.province_id));
          // console.log('country_code foundData =', foundData);
          item.dimensions.country_code_name = foundData.name;
          item.dimensions.country_code_locationId = foundData.locationId;
        }
      }
    } else if (dimensionAddJoin === 'language') {
      for (const item of arr) {
        // console.log('language item =', item);
        const foundData = await language.findOne({ code: item.dimensions.language });
        // console.log('language foundData =', foundData);
        item.dimensions.language_name = foundData.name;
      }
    } else if (dimensionAddJoin === 'interest_category') {
      for (const item of arr) {
        // console.log('interest_category item =', item);

        // category v1
        const foundDataV1 = await category.findOne({ interestCategoryId: item.dimensions.interest_category, version: 1 });
        // console.log('interest_category v1 foundData =', foundDataV1);
        item.dimensions.interest_category_name = foundDataV1.interestCategoryName;

        // category v2
        const foundDataV2 = await category.findOne({ interestCategoryId: item.dimensions.interest_category_v2, version: 2 });
        // console.log('interest_category v2 foundData =', foundDataV2);
        item.dimensions.interest_category_v2_name = foundDataV2.interestCategoryName;
      }
    }

    if (arr.length > 0) {
      const userTiktok = vad.collection(CONFDB.DB.TIKTOK.COLLECTION);
      const data = {
        userId,
        apiId: 'campaigns',
        dataType: 'insight',
        adAccountId: advertiserIds,
        adAccountName: advertiserName,
        serviceType: 'AUCTION',
        reportType: 'AUDIENCE', // report_type
        breakdowns: dimensionAddJoin,
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
