const adsSdk = require('facebook-nodejs-business-sdk');

// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const CONF = require('../config/api');
const resultMapping = require('./facebookResultMapping');
const excelReportVideo3sec = require('./excelReportVideo3sec');
const excelReportAppInstall = require('./excelReportAppInstall');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const Campaign = adsSdk.Campaign;
const AdSet = adsSdk.AdSet;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (fields, startDay, endDay, accountId, campaignIdsArray) {
  try {
    const ids = [];
    const resultAdSetInfo = [];

    // 캠페인 id 각각 adset 처리
    for (const campaignId of campaignIdsArray) {
      const fieldsAdSet = [
        'id',
        'name',
        'campaign_id',
        'attribution_spec', // 결과지표관련 기여설정정보 (ex: "7일간의 클릭수 또는 1일간의 조회수") > 이 정보를 통해서 1차적으로 action의 value를 맞게 구할 수 있음
        'promoted_object', // 광고 게재 최적화 기준 (결과 지표 관련) > 데이터가 없는 경우 있음
      ];
      // 지출이 있으면 포함해야 함
      const paramsAdSet = {
        time_range: { since: startDay, until: endDay },
        // effective_status: ['ACTIVE'],
        filtering: [{ field: 'ad.spend', operator: 'GREATER_THAN', value: 0 }],
      };
      // let adSetsInfos = await account.getAdSets(fieldsAdSet, paramsAdSet);
      let adSetsInfos = await new Campaign(campaignId).getAdSets(fieldsAdSet, paramsAdSet);
      // console.log('adSetsInfos =', adSetsInfos);

      const adSetsIds = [];
      adSetsInfos.map((element) => adSetsIds.push(element._data));
      // console.log('adSetsIds.length =', adSetsIds.length);
      while (adSetsInfos.hasNext()) {
        adSetsInfos = await adSetsInfos.next();
        adSetsInfos.map((element) => adSetsIds.push(element._data));
      }
      // console.log('adSetsIds =', adSetsIds);
      // console.log('adSetsIds.length =', adSetsIds.length);
      ids.push(...adSetsIds);

      for (const itemAdSets of adSetsIds) {
        // console.log(' ');
        // console.log('adset id =', itemAdSets.id);
        // console.log('adset name =', itemAdSets.name);
        // console.log('adset attribution_spec =', itemAdSets.attribution_spec);

        const actionAttributionWindows = [];
        if (itemAdSets.attribution_spec) {
          for (const specItem of itemAdSets.attribution_spec) {
            if (specItem.event_type === 'CLICK_THROUGH') {
              actionAttributionWindows.push(specItem.window_days + 'd_click');
            }
            if (specItem.event_type === 'VIEW_THROUGH') {
              actionAttributionWindows.push(specItem.window_days + 'd_view');
            }
          }
        } else {
          actionAttributionWindows.push('1d_view');
          // console.log('adset actionAttributionWindows 없음');
        }
        // console.log('adset actionAttributionWindows =', actionAttributionWindows);

        const adSet = new AdSet(itemAdSets.id);
        // const fieldsInsight = CONF.FACEBOOK.FIELDS;
        const fieldsInsight = fields;
        const paramsAdSetInsight = {
          time_range: { since: startDay, until: endDay },
          action_attribution_windows: actionAttributionWindows,
        };
        // console.log('fieldsInsight =', fieldsInsight);
        let insightsAdSets = await adSet.getInsights(fieldsInsight, paramsAdSetInsight);
        const resultAdSets = [];
        insightsAdSets.map((element) => resultAdSets.push(element._data));
        while (insightsAdSets.hasNext()) {
          insightsAdSets = await insightsAdSets.next();
          insightsAdSets.map((element) => resultAdSets.push(element._data));
        }
        // console.log('resultAdSets =', resultAdSets);
        // console.log(campaignId, 'AdSets.length =', resultAdSets.length);

        // 결과 관련 정보 확인
        for (const item of resultAdSets) {
          if (item.actions) {
            const resultValue = await resultMapping.request(
              itemAdSets.attribution_spec,
              itemAdSets.promoted_object,
              item.actions,
              item.objective,
              item.optimization_goal,
              item.conversions,
              item.conversion_values,
              actionAttributionWindows
            );
            item.result = resultValue;
            // result 지표 참고용 지표 저장해봄
            item.attribution_spec = itemAdSets.attribution_spec;
            item.promoted_object = itemAdSets.promoted_object;
            item.actionAttributionWindows = actionAttributionWindows;

            // 동영상 3초이상 재생, 앱 설치 처리
            item.video3secPlay = await excelReportVideo3sec.request(item.actions);
            item.appInstall = await excelReportAppInstall.request(item.actions);
          } else {
            item.result = 0;
            // result 지표 참고용 지표 저장해봄
            item.attribution_spec = itemAdSets.attribution_spec;
            item.promoted_object = itemAdSets.promoted_object;
            item.actionAttributionWindows = actionAttributionWindows;

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

        resultAdSetInfo.push(resultAdSets[0]);
        /*
        const vad = await db.connection(CONFDB.DB.NAME);
        const excelReport = vad.collection(CONFDB.DB.REPORT.COLLECTION);

        const data = {
          userId: 'vibezone',
          apiId: 'adSets',
          dataType: 'insight',
          adAccountId: accountId,
          campaignId: itemAdSets.campaign_id,
          adSetId: itemAdSets.id,
          adSetName: itemAdSets.name,
          data: resultAdSets[0],
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
            startDay: data.startDay,
            endDay: data.endDay,
          },
          { $set: data },
          { upsert: true }
        );
        */
      }
    }
    const result = [ids, resultAdSetInfo];
    console.log('비용이 있는 adset id =', ids);
    console.log('비용이 있는 adset 인사이트 갯수 =', resultAdSetInfo.length);
    // console.log('비용이 있는 adset 인사이트 =', resultAdSetInfo);
    return result;
  } catch (err) {
    console.log(err.message);
  } finally {
    // db.close();
  }
};
