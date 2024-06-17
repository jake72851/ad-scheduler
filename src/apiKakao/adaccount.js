const axios = require('../util/axios');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');
const wait = require('waait');
const waitTime = 5000;

exports.request = async function (accessToken, userId, accountId, accountName, startDate, endDate) {
  const header = {
    Authorization: 'Bearer ' + accessToken,
    adAccountId: accountId,
  };

  for (const itemDimension of CONF.KAKAO.DIMENSION) {
    for (const itemMetrics of CONF.KAKAO.METRICS) {
      // 광고계정 보고서 보기 > 이 API는 광고계정 번호, 앱 ID당 5초에 한 번으로 요청
      const param = {
        timeUnit: 'DAY',
        start: startDate,
        end: endDate,
        level: 'AD_ACCOUNT',
        metricsGroup: itemMetrics,
      };
      // dimension이 없어야하는 경우처리
      if (itemDimension !== 'none') {
        param.dimension = itemDimension;
      }
      const report = await axios.request('GET', CONF.KAKAO.API + CONF.KAKAO.API_ADACCOUNT, param, '', header);
      if (report.data.length > 0) {
        for (const dataResult of report.data) {
          const vad = await db.connection(CONFDB.DB.NAME);
          const userKakao = vad.collection(CONFDB.DB.KAKAO.COLLECTION);

          const data = {
            userId,
            kakaoMediaType: 'moment',
            apiId: 'adAccounts',
            dataType: 'insight',
            adAccountId: accountId,
            adAccountName: accountName,
            // breakdowns: null,
            reportType: itemMetrics, // report_type
            data: dataResult,
            createdDay: dataResult.start,
            // startDate: dataResult.start,
            // endDate: dataResult.end,
            createdAt: new Date(dataResult.start + 'T00:00:00Z'),
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
              breakdowns: data.breakdowns,
              reportType: data.reportType,
              createdDay: data.createdDay,
              // startDate: data.startDate,
              // endDate: data.endDate,
            },
            { $set: data },
            { upsert: true }
          );
        }
      }
      await wait(waitTime);
    }
  }
};
