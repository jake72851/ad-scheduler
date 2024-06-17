const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');
const CONF = require('../../../config/api');
// const { GoogleAdsApi } = require('google-ads-api');
const axios = require('axios');

exports.request = async function (accessToken, userId, customerId, customerName, termDay) {
  const headers = {
    Authorization: 'Bearer ' + accessToken,
    'developer-token': CONF.GOOGLE.DEVELOPER_TOKEN,
    'login-customer-id': CONF.GOOGLE.LOGIN_CUSTOMER_ID,
  };
  const selectFields = [
    'segments.conversion_action',
    'segments.conversion_action_category',
    'segments.conversion_action_name',

    'metrics.all_conversions',
    'metrics.all_conversions_value',
    'metrics.conversions',
    'metrics.conversions_value',

    'customer.descriptive_name',
    'customer.id',

    'campaign.id',
    'campaign.name',

    'ad_group.id',
    'ad_group.name',
  ];
  const selectFieldString = selectFields.join(', ');
  const query = {
    query: `
    SELECT 
      ${selectFieldString} 
    FROM 
      ad_group 
    WHERE 
      segments.date = '${termDay}'
  `,
  };
  const result = await axios.post(CONF.GOOGLE.API + customerId + CONF.GOOGLE.API_END, query, { headers }).catch((error) => {
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
  // console.log('adGroups result =', result.data.results);
  /*
  result = [
  {
    customer: {
      resourceName: 'customers/5318998392',
      id: '5318998392',
      descriptiveName: '더브이플래닛 내부광고계정'
    },
    campaign: {
      resourceName: 'customers/5318998392/campaigns/19420534263',
      name: '2_브이플레이트_SA(확장)',
      id: '19420534263'
    },
    adGroup: {
      resourceName: 'customers/5318998392/adGroups/144839605837',
      id: '144839605837',
      name: '2_1_브이플레이트(확장)_221230'
    },
    metrics: {
      conversionsValue: 0,
      conversions: 0,
      allConversionsValue: 7,
      allConversions: 7
    },
    segments: {
      conversionActionCategory: 'PAGE_VIEW',
      conversionAction: 'customers/5318998392/conversionActions/6442640065',
      conversionActionName: '브이플레이트_페이지방문'
    }
  }
]
  */

  if (result.data.results && result.data.results.length > 0) {
    const vad = await db.connection(CONFDB.DB.NAME);
    const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

    const data = {
      userId,
      apiId: 'adGroups',
      dataType: 'result',
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
