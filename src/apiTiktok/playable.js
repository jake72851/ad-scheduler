const axios = require('axios');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');

exports.request = async function (userId, advertiserIds, advertiserName, termDay, dimension) {
  console.log('termDay =', termDay);
  const requestPageSize = CONF.TIKTOK.API_REQUESTPAGESIZE;

  const dimensionJoin = dimension.join(', ');

  const datas = {
    advertiser_id: advertiserIds,
    service_type: 'AUCTION', // 광고 서비스 유형. 열거형 값: AUCTION(경매 광고), RESERVATION(예약 광고). 기본값: AUCTION.
    // data_level: 'AUCTION_CAMPAIGN', // 지원안함
    report_type: 'PLAYABLE_MATERIAL', // Report type. Enum values: BASIC (basic report), AUDIENCE (audience report), PLAYABLE_MATERIAL (playable ads report), CATALOG (DSA report).
    dimensions: dimension,
    metrics: [
      // Attribute metrics >
      'playable_id',
      'playable_name',
      'playable_url',
      'preview_url',
      'create_time',
      'modify_time',
      'playable_status',
      'orientation',
      'country',
      'associated_adgroup_count',

      // Basic data metrics >
      'spend',
      'cpm',
      'impressions',
      'clicks',
      'ctr',
      'conversion', // 선택한 두 번째 목표를 기준으로 광고가 결과를 달성한 횟수입니다. 하나의 캠페인에 다양한 2차 목표가 있을 수 있으므로 이 통계는 캠페인에 대해 지원되지 않습니다. 보려면 광고그룹 또는 광고로 이동하세요. (총 횟수는 각 광고 노출이 발생한 시간을 기준으로 계산됩니다.)
      'cost_per_conversion', // CPA
      'conversion_rate', // CVR (%)
      'currency',

      // In-App Event metrics (Unique) >
      'app_install',
      'cost_per_app_install',
      'app_install_rate',

      // Playable ads event metrics >
      'playable_page_view_count',
      'playable_first_scene_view_count',
      'playable_second_scene_view_count',
      'playable_third_scene_view_count',
      'playable_cta_click',
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
  // console.log('playable 인사이트 result =', result);

  if (result.data.message !== 'OK') {
    console.log('playable ' + dimensionJoin + ' 인사이트 err =', result.data.message);
  } else {
    console.log('playable ' + dimensionJoin + ' 인사이트 result page_info =', result.data.data.page_info);
    // console.log('playable ' + dimensionJoin + ' 인사이트 result list =', result.data.data.list);
    console.log('playable ' + dimensionJoin + ' 인사이트 result list.length =', result.data.data.list.length);

    const arr = result.data.data.list;
    for (let i = 1; i < result.data.data.page_info.total_page; i++) {
      console.log('page num =', i + 1);
      datas.page = i + 1;
      const result = await axios(config);
      arr.push(...result.data.data.list);
    }
    // console.log('arr =', arr);
    console.log('arr.length =', arr.length);

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
        reportType: 'PLAYABLE_MATERIAL',
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
