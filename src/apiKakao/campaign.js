// const axios = require('axios');
const axios = require('../util/axios');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');
const wait = require('waait');
const waitTime = 5000;

exports.request = async function (accessToken, userId, accountId, accountName, startDate, endDate, campaignsIdsArr) {
  console.log(' ');

  const header = {
    Authorization: 'Bearer ' + accessToken,
    adAccountId: accountId,
  };

  for (const itemDimension of CONF.KAKAO.DIMENSION) {
    for (const itemMetrics of CONF.KAKAO.METRICS) {
      // 광고계정 보고서 보기 > 이 API는 광고계정 번호, 앱 ID당 5초에 한 번으로 요청
      const param = {
        campaignId: campaignsIdsArr,

        // 사전 정의된 보고서 조회기간 (사용 가능한 값: TODAY, YESTERDAY, LAST_7DAY, LAST_14DAY, LAST_30DAY, THIS_MONTH, LAST_MONTH)
        // datePreset: 'TODAY',

        // 보고서 집계 기간 단위 (사용 가능한 값: DAY(기본값) 참고: 시간대별 조회는 dimension 필드의 HOUR를 이용하여 확인 가능합니다.))
        timeUnit: 'DAY',

        // 조회기간은 총 31일 이내 범위로 설정 가능 (yyyyMMdd 형식)
        start: startDate,
        end: endDate,
        // start: '20221201',
        // end: '20221231',

        level: 'CAMPAIGN',

        // 보고서 조회 기준 - 사용 가능한 값: CREATIVE_FORMAT, PLACEMENT, AGE, GENDER, AGE_GENDER, LOCATION, DEVICE_TYPE, HOUR
        // dimension: 'HOUR',

        // 보고서 지표 그룹 (사용 가능한 값: BASIC, ADDITION, MESSAGE, MESSAGE_ADDITION, MESSAGE_CLICK, PLUS_FRIEND, PIXEL_SDK_CONVERSION, SLIDE_CLICK, TALK_CONVERSION, VIDEO, ADVIEW, BIZ_BOARD, SPB)
        metricsGroup: itemMetrics,
      };
      // dimension이 없어야하는 경우처리
      if (itemDimension !== 'none') {
        param.dimension = itemDimension;
      }
      const report = await axios.request('GET', CONF.KAKAO.API + CONF.KAKAO.API_CAMPAIGN, param, '', header);

      if (report.data.length > 0) {
        for (const dataResult of report.data) {
          const vad = await db.connection(CONFDB.DB.NAME);
          const userKakao = vad.collection(CONFDB.DB.KAKAO.COLLECTION);

          const data = {
            userId,
            kakaoMediaType: 'moment',
            apiId: 'campaigns',
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
