const axios = require('../util/axios');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');
const dayjs = require('dayjs');

exports.request = async function (accessToken, userId, accountId, accountName, termDay) {
  console.log(' ');
  console.log('광고계정 insight ');

  const header = {
    Authorization: 'Bearer ' + accessToken,
    adAccountId: accountId,
  };
  for (const itemMetrics of CONF.KAKAO.METRICS_KEYWORD) {
    // BASIC 만 지원
    if (itemMetrics === 'BASIC') {
      for (const itemDimension of CONF.KAKAO.DIMENSION_KEYWORD) {
        // none, HOUR 만 지원
        if (itemDimension === 'HOUR' || itemDimension === 'none') {

          const param = {
            // 사전 정의된 보고서 조회기간 (사용 가능한 값: TODAY, YESTERDAY, LAST_7DAY, LAST_14DAY, LAST_30DAY, THIS_MONTH, LAST_MONTH)
            // datePreset: 'TODAY',

            // 보고서 집계 기간 단위 (사용 가능한 값: DAY(기본값) 참고: 시간대별 조회는 dimension 필드의 HOUR를 이용하여 확인 가능합니다.))
            // timeUnit: 'DAY',

            // 조회기간은 총 31일 이내 범위로 설정 가능 (yyyyMMdd 형식)
            start: termDay,
            end: termDay,
            // start: '20221201',
            // end: '20221231',

            // 광고계정 보고서에서는 BASIC만 제공
            metricsGroups: itemMetrics,
          };
          // dimension이 없어야하는 경우처리
          if (itemDimension !== 'none') {
            param.dimension = itemDimension;
          }
          console.log('param =', param);
          const report = await axios.request('GET', CONF.KAKAO.API_KEYWORD + CONF.KAKAO.API_ADACCOUNT, param, '', header);
          console.log('report =', report);

          if (report.data.length > 0) {
            const vad = await db.connection(CONFDB.DB.NAME);
            const userKakao = vad.collection(CONFDB.DB.KAKAO.COLLECTION);

            const data = {
              userId,
              kakaoMediaType: 'keyword',
              apiId: 'adAccounts',
              dataType: 'insight',
              adAccountId: accountId,
              adAccountName: accountName,
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
                breakdowns: data.breakdowns,
                reportType: data.reportType,
                createdDay: data.createdDay,
              },
              { $set: data },
              { upsert: true }
            );
          }
        }
      }
    }
  }
};
