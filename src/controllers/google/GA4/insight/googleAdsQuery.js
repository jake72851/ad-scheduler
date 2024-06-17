const db = require('../../../../db/connect');
const CONFDB = require('../../../../config/db');
const CONF = require('../../../../config/api');
// const { GoogleAdsApi, enums } = require('google-ads-api');
const axios = require('axios');
const resultRemap = require('../../../../util/googleGA4ResultEdit');

exports.request = async function (accessToken, userId, GA4Id, termDay, accountId, accountName) {
  const headers = {
    Authorization: 'Bearer ' + accessToken,
  };
  const data = {
    requests: [
      {
        dateRanges: [
          {
            startDate: termDay,
            endDate: termDay,
          },
        ],
        dimensions: [
          {
            name: 'googleAdsQuery',
          },
        ],
        metrics: [
          {
            name: 'active1DayUsers',
          },
          {
            name: 'active28DayUsers',
          },
          {
            name: 'active7DayUsers',
          },
          {
            name: 'activeUsers',
          },
          {
            name: 'averagePurchaseRevenuePerPayingUser',
          },
          {
            name: 'averagePurchaseRevenuePerUser',
          },
          {
            name: 'bounceRate',
          },
          {
            name: 'conversions',
          },
        ],
      },
      {
        dateRanges: [
          {
            startDate: termDay,
            endDate: termDay,
          },
        ],
        dimensions: [
          {
            name: 'googleAdsQuery',
          },
        ],
        metrics: [
          {
            name: 'dauPerMau',
          },
          {
            name: 'dauPerWau',
          },
          {
            name: 'engagedSessions',
          },
          {
            name: 'engagementRate',
          },
          {
            name: 'eventValue',
          },
          {
            name: 'firstTimePurchaserConversionRate',
          },
        ],
      },
      {
        dateRanges: [
          {
            startDate: termDay,
            endDate: termDay,
          },
        ],
        dimensions: [
          {
            name: 'googleAdsQuery',
          },
        ],
        metrics: [
          {
            name: 'firstTimePurchasers',
          },
          {
            name: 'purchaseRevenue',
          },
        ],
      },
      {
        dateRanges: [
          {
            startDate: termDay,
            endDate: termDay,
          },
        ],
        dimensions: [
          {
            name: 'googleAdsQuery',
          },
        ],
        metrics: [
          {
            name: 'purchaseToViewRate',
          },
          {
            name: 'purchaserConversionRate',
          },
          {
            name: 'returnOnAdSpend',
          },
          {
            name: 'sessionConversionRate',
          },
          {
            name: 'sessions',
          },
          {
            name: 'sessionsPerUser',
          },
        ],
      },
      {
        dateRanges: [
          {
            startDate: termDay,
            endDate: termDay,
          },
        ],
        dimensions: [
          {
            name: 'googleAdsQuery',
          },
        ],
        metrics: [
          {
            name: 'totalAdRevenue',
          },
          {
            name: 'totalPurchasers',
          },
          {
            name: 'totalRevenue',
          },
          {
            name: 'totalUsers',
          },
          {
            name: 'userConversionRate',
          },
          {
            name: 'wauPerMau',
          },
        ],
      },
    ],
  };
  const result = await axios
    .post(CONF.GOOGLE.GA4_DATA + CONF.GOOGLE.GA4_PROPERTIES + GA4Id + CONF.GOOGLE.GA4_BATCH, data, { headers })
    .catch((error) => {
      // 오류 발생 시 오류 메시지 출력
      if (error.response) {
        // 응답이 도착한 경우
        console.log('응답 오류:', error.response);
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
  // console.log('GA4 googleAdsQuery =', result.data);

  if (
    result.data.reports &&
    result.data.reports.length > 0 &&
    result.data.reports[0].rows &&
    result.data.reports[0].rows.length > 0 &&
    result.data.reports[0].rowCount > 0
  ) {
    // console.log('GA4 googleAdsQuery =', result.data.reports);

    // aggregation용 mapping 처리
    const reData = await resultRemap.request(result.data.reports);

    const vad = await db.connection(CONFDB.DB.NAME);
    const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

    const data = {
      userId,
      apiId: 'GA4',
      dataType: 'insight',
      adAccountId: accountId,
      adAccountName: accountName,
      GA4Id,
      breakdowns: 'googleAdsQuery',
      // data: result.data.reports,
      data: reData,
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
        GA4Id: data.GA4Id,
        breakdowns: data.breakdowns,
      },
      { $set: data },
      { upsert: true }
    );

    // return result.data.reports;
  } else {
    console.log('GA4 googleAdsQuery = 없어요');
    // return null;
  }
};
