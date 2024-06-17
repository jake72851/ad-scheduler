const adsSdk = require('facebook-nodejs-business-sdk');

// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const CONF = require('../config/api');
const resultMappingAds = require('./facebookResultMappingAds');
const excelReportVideo3sec = require('./excelReportVideo3sec');
const excelReportAppInstall = require('./excelReportAppInstall');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdSet = adsSdk.AdSet;
const Ad = adsSdk.Ad;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (fields, startDay, endDay, accountId, adSetsIds) {
  try {
    // 리포트 정보 저장
    const adReports = [];

    for (const itemAdSets of adSetsIds) {
      // console.log('itemAdSets =', itemAdSets);
      const fieldsAcc = ['id', 'name', 'campaign_id', 'adset_id'];
      // 지출이 있으면 무조건 포함
      const paramsAcc = {
        time_range: { since: startDay, until: endDay },
        // effective_status: ['ACTIVE'],
        filtering: [{ field: 'ad.spend', operator: 'GREATER_THAN', value: 0 }],
      };
      let adInfos = await new AdSet(itemAdSets.id).getAds(fieldsAcc, paramsAcc);
      // console.log('adInfos =', adInfos);

      const resultIds = [];
      adInfos.map((element) => resultIds.push(element._data));
      while (adInfos.hasNext()) {
        adInfos = await adInfos.next();
        adInfos.map((element) => resultIds.push(element._data));
      }
      // console.log('ad id 정보 =', resultIds);
      console.log('adset id =', itemAdSets.id, ' / ad 갯수 정보 =', resultIds.length);

      for (const itemAds of resultIds) {
        const ad = new Ad(itemAds.id);
        const fieldsInsight = fields;
        const paramsInsight = {
          time_range: { since: startDay, until: endDay },
        };
        let insights = await ad.getInsights(fieldsInsight, paramsInsight);
        const resultAd = [];
        insights.map((element) => resultAd.push(element._data));
        while (insights.hasNext()) {
          insights = await insights.next();
          insights.map((element) => resultAd.push(element._data));
        }
        // console.log('resultAd =', resultAd);

        // 결과 관련 정보 확인
        for (const item of resultAd) {
          if (item.actions) {
            const resultValue = await resultMappingAds.request(
              item.actions,
              item.objective,
              item.optimization_goal,
              item.conversions,
              item.conversion_values
            );
            item.result = resultValue;

            // 동영상 3초이상 재생, 앱 설치 처리
            item.video3secPlay = await excelReportVideo3sec.request(item.actions);
            item.appInstall = await excelReportAppInstall.request(item.actions);
          } else {
            item.result = 0;

            // 동영상 3초이상 재생, 앱 설치 처리
            item.video3secPlay = '';
            item.appInstall = '';
          }
          // 앱 설치 당 비용 처리
          if (item.cost_per_action_type) {
            item.appInstallCost = await excelReportAppInstall.request(item.cost_per_action_type);
          } else {
            item.appInstallCost = '';
          }
          // ctr 이 없는 경우 예외 처리
          if (!item.ctr) {
            item.ctr = '0';
          }
          // cpc 이 없는 경우 예외 처리
          if (!item.cpc) {
            item.cpc = '0';
          }
          // cpm 이 없는 경우 예외 처리
          if (!item.cpm) {
            item.cpm = '0';
          }
        }

        adReports.push(resultAd[0]);
        /*
        const vad = await db.connection(CONFDB.DB.NAME);
        const excelReport = vad.collection(CONFDB.DB.REPORT.COLLECTION);

        const data = {
          userId: 'vibezone',
          apiId: 'ads',
          dataType: 'insight',
          adAccountId: accountId,
          campaignId: itemAds.campaign_id,
          adSetId: itemAds.adset_id,
          adId: itemAds.id,
          adName: itemAds.name,
          data: resultAd[0],
          // imageUrl,
          // thumbnailUrl,
          // creativeId: adInfo._data.creative.id,
          startDay,
          endDay,
          createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
        };
        await excelReport.updateOne(
          {
            userId: data.userId,
            apiId: data.apiId,
            dataType: data.dataType,
            adAccountId: data.adAccountId,
            campaignId: data.campaignId,
            adSetId: data.adSetId,
            adId: data.adId,
            startDay: data.startDay,
            endDay: data.endDay,
          },
          { $set: data },
          { upsert: true }
        );
        */
      }
    }

    return adReports;
  } catch (err) {
    console.log(err.message);
  } finally {
    // db.close();
  }
};
