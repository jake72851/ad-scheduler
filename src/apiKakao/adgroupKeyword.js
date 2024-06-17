// const axios = require('axios');
const axios = require('../util/axios');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');
const wait = require('waait');
const waitTime = 5000; // API 요청 제한
const dayjs = require('dayjs');

exports.request = async function (accessToken, userId, accountId, accountName, campaignId, campaignName, termDay) {
  console.log(' ');
  console.log('adGroups insight ');

  const header = {
    Authorization: 'Bearer ' + accessToken,
    adAccountId: accountId,
  };
  for (const itemMetrics of CONF.KAKAO.METRICS_KEYWORD) {
    for (const itemDimension of CONF.KAKAO.DIMENSION_KEYWORD) {
      // 문서상에는 있으나 실제 요청하면 오류나는 Dimension 제외
      if (itemDimension !== 'KEYWORD_EX' && itemDimension !== 'ASSET_TYPE') {
        console.log('itemDimension =', itemDimension);
        console.log('itemMetrics =', itemMetrics);
        const param = {
          campaignId,

          start: termDay,
          end: termDay,
          // start: '20221201',
          // end: '20221231',

          metricsGroups: itemMetrics,
        };
        // dimension이 없어야하는 경우처리
        if (itemDimension !== 'none') {
          param.dimension = itemDimension;
        }
        const report = await axios.request('GET', CONF.KAKAO.API_KEYWORD + CONF.KAKAO.API_ADGROUP, param, '', header);
        console.log('report =', report);
        /*
         */

        if (report.data.length > 0) {
          const vad = await db.connection(CONFDB.DB.NAME);
          const userKakao = vad.collection(CONFDB.DB.KAKAO.COLLECTION);

          const data = {
            userId,
            kakaoMediaType: 'keyword',
            apiId: 'adGroups',
            dataType: 'insight',
            adAccountId: accountId,
            adAccountName: accountName,
            campaignId,
            campaignName,
            // breakdowns: null,
            reportType: itemMetrics, // report_type
            data: report.data,
            createdDay: dayjs(termDay).format('YYYY-MM-DD'),
            createdAt: new Date(dayjs(termDay).format('YYYY-MM-DD') + 'T00:00:00Z'),
            createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
          };
          if (itemDimension !== 'none') {
            data.breakdowns = itemDimension;
          } else {
            data.breakdowns = null;
          }
          await userKakao.updateOne(
            {
              userId: data.userId,
              kakaoMediaType: data.kakaoMediaType,
              apiId: data.apiId,
              dataType: data.dataType,
              adAccountId: data.adAccountId,
              campaignId: data.campaignId,
              breakdowns: data.breakdowns,
              reportType: data.reportType,
              createdDay: data.createdDay,
            },
            { $set: data },
            { upsert: true }
          );
        }
        await wait(waitTime);
      }
    }
  }
};
