const axios = require('axios');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');

exports.request = async function (userId, advertiserIds, advertiserName, termDay, dimensionAdd) {
  const requestPageSize = CONF.TIKTOK.API_REQUESTPAGESIZE;

  const dimension = dimensionAdd.map((element) => {
    if (element === 'AD_LEVEL') {
      return 'campaign_id';
    } else {
      return element;
    }
  });
  console.log('캠페인 dimension =', dimension);
  // ID dimensions >
  // 'advertiser_id',
  // 'campaign_id',
  // 'adgroup_id',
  // 'ad_id',

  // Time dimensions >
  // 'stat_time_day', // 포함시 활성화된 캠페인만 출력되는것으로 예상
  // 'stat_time_hour',

  // Dimension Grouping >
  // 'country_code',

  const datas = {
    advertiser_id: advertiserIds,
    service_type: 'RESERVATION', // 광고 서비스 유형. 열거형 값: AUCTION(경매 광고), RESERVATION(예약 광고). 기본값: AUCTION.
    data_level: 'RESERVATION_CAMPAIGN', // ['AUCTION_ADVERTISER', 'RESERVATION_AD', 'RESERVATION_ADGROUP', 'AUCTION_ADGROUP', 'RESERVATION_CAMPAIGN', 'AUCTION_AD', 'AUCTION_CAMPAIGN', 'RESERVATION_ADVERTISER']
    report_type: 'BASIC', // Report type. Enum values: BASIC (basic report), AUDIENCE (audience report), PLAYABLE_MATERIAL (playable ads report), CATALOG (DSA report).

    dimensions: dimension,

    metrics: [
      // Attribute metrics >
      // 'campaign_id', // Supported in Ad Group and Ad level only.
      // 'adgroup_name', // Supported in Ad Group and Ad level only.
      // 'adgroup_id', // Supported in Ad level only.
      // 'ad_name', // Supported in Ad level only.

      // Basic data metrics >
      'impressions',
      'clicks',
      'ctr',
      'reach',
      'cost_per_1000_reached',
      'frequency',
      'currency',

      // Video play metrics >
      'video_play_actions',
      'video_watched_2s',
      'video_watched_6s',
      'video_views_p25',
      'video_views_p50',
      'video_views_p75',
      'video_views_p100',
      'average_video_play',
      'average_video_play_per_user',

      // Engagement metrics >
      // 'comments', // 캠페인 지원안함
      // 'shares', // 캠페인 지원안함
      'profile_visits',
      'follows',
      'clicks_on_music_disc', // 캠페인 기간 동안 Spard Ads에서 공식 음악을 클릭한 횟수입니다.
      'clicks_on_hashtag_challenge', // 캠페인 기간 동안 광고의 해시태그 챌린지에 대한 총 클릭 수입니다.
      // 'engagements', // 캠페인 지원안함
      // 'engagement_rate', // 캠페인 지원안함
      'skip_ad',

      // Additional format metrics >
      'interact_card_a_click_cnt',
      'interact_card_b_click_cnt',
      'vote_card_show_cnt',
      'vote_card_a_click_cnt',
      'vote_card_b_click_cnt',
      'vote_card_convert_click_cnt',
      'redpacket_show_cnt',
      'redpacket_click_cnt',
      'image_card_show_cnt',
      'image_card_click_cnt',
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
  // console.log('캠페인 RESERVATION 인사이트 result =', result);

  const dimensionJoin = dimension.join(', ');

  if (result.data.message !== 'OK') {
    console.log('캠페인 RESERVATION ' + dimensionJoin + ' 인사이트 err =', result.data.message);
  } else {
    console.log('캠페인 RESERVATION ' + dimensionJoin + ' 인사이트 result page_info =', result.data.data.page_info);
    // console.log('캠페인 RESERVATION ' + dimensionJoin + ' 인사이트 result list =', result.data.data.list);
    console.log('캠페인 RESERVATION ' + dimensionJoin + ' 인사이트 result list.length =', result.data.data.list.length);

    const arr = result.data.data.list;
    for (let i = 1; i < result.data.data.page_info.total_page; i++) {
      console.log('page num =', i + 1);
      datas.page = i + 1;
      const result = await axios(config);
      arr.push(...result.data.data.list);
    }
    // console.log('arr =', arr);
    console.log('캠페인 RESERVATION ' + dimensionJoin + ' arr.length =', arr.length);

    if (arr.length > 0) {
      const vad = await db.connection(CONFDB.DB.NAME);
      const userTiktok = vad.collection(CONFDB.DB.TIKTOK.COLLECTION);
      const data = {
        userId,
        apiId: 'campaigns',
        dataType: 'insight',
        adAccountId: advertiserIds,
        adAccountName: advertiserName,
        serviceType: 'RESERVATION',
        reportType: 'BASIC', // service_type
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
