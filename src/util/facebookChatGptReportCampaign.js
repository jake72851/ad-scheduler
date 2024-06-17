const adsSdk = require('facebook-nodejs-business-sdk');

const db = require('../db/connect');
const CONFDB = require('../config/db');
const CONF = require('../config/api');
const excelReportVideo3sec = require('./excelReportVideo3sec');
const excelReportAppInstall = require('./excelReportAppInstall');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const Campaign = adsSdk.Campaign;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (fields, startDay, endDay, accountId) {
  try {
    const account = new AdAccount(accountId);

    const fieldsAcc = [
      'id',
      'name',
      'status',
      // 'attribution_spec', // 기여 설정 (결과 지표 관련) > 지원안됨
      'promoted_object', // 광고 게재 최적화 기준 (결과 지표 관련) > 정보 안나옴
    ];
    // 지출이 있으면 무조건 포함
    const paramsAcc = {
      time_range: { since: startDay, until: endDay },
      // effective_status: ['ACTIVE'],
      filtering: [{ field: 'ad.spend', operator: 'GREATER_THAN', value: 0 }],
    };
    let campaignsInfos = await account.getCampaigns(fieldsAcc, paramsAcc);
    // console.log('campaignsInfos =', campaignsInfos);

    const infoResult = [];
    campaignsInfos.map((element) => infoResult.push(element._data));
    while (campaignsInfos.hasNext()) {
      campaignsInfos = await campaignsInfos.next();
      campaignsInfos.map((element) => infoResult.push(element._data));
    }
    // console.log('campaigns id 정보 =', infoResult);
    console.log('campaigns.length =', infoResult.length);
    /*
    const resultIds = [
      {
        id: '23854134938800456',
        name: '7_Philippines_앱설치(신규)',
      },
      {
        id: '23851527143560456',
        name: '24_Bangladesh_앱설치(AOS)',
      },
      {
        id: '23854726060350456',
        name: '15_Brazil_앱설치(AOS)',
      },
    ];
    */

    const resultIds = [];
    const resultCampaignInfo = [];
    for (const itemCampaigns of infoResult) {
      // id save
      resultIds.push(itemCampaigns.id);

      const campaign = new Campaign(itemCampaigns.id);
      const fieldsInsight = fields;
      const paramsInsight = {
        time_range: { since: startDay, until: endDay },
        breakdowns: 'publisher_platform',
      };
      let insights = await campaign.getInsights(fieldsInsight, paramsInsight);
      // console.log('캠페인 insights =', insights);

      const insightsResult = [];
      insights.map((element) => insightsResult.push(element._data));
      while (insights.hasNext()) {
        insights = await insights.next();
        insights.map((element) => insightsResult.push(element._data));
      }
      // console.log('insightsResult =', insightsResult);

      for (const item of insightsResult) {
        // 동영상 3초이상 재생 / 앱 설치 처리
        if (item.actions) {
          item.video3secPlay = await excelReportVideo3sec.request(item.actions);
          item.appInstall = await excelReportAppInstall.request(item.actions);
        } else {
          item.video3secPlay = '';
          item.appInstall = '';
        }
        // 앱 설치 당 비용 처리
        if (item.cost_per_action_type) {
          item.appInstallCost = await excelReportAppInstall.request(item.cost_per_action_type);
        } else {
          item.appInstallCost = '';
        }
      }

      // insights save
      resultCampaignInfo.push(insightsResult);

      const vad = await db.connection(CONFDB.DB.NAME);
      const jsonReport = vad.collection(CONFDB.DB.JSON.COLLECTION);

      const data = {
        userId: 'vibezone',
        apiId: 'campaigns',
        dataType: 'insight',
        adAccountId: accountId,
        campaignId: itemCampaigns.id,
        campaignName: itemCampaigns.name,
        breakdowns: 'publisher_platform',
        data: insightsResult,
        startDay,
        endDay,
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      await jsonReport.updateOne(
        {
          userId: data.userId,
          apiId: data.apiId,
          dataType: data.dataType,
          adAccountId: data.adAccountId,
          campaignId: data.campaignId,
          breakdowns: data.breakdowns,
          startDay: data.startDay,
          endDay: data.endDay,
        },
        { $set: data },
        { upsert: true }
      );
    }
    const result = [resultIds, resultCampaignInfo];
    console.log('비용이 있는 캠페인 id =', resultIds);
    console.log('비용이 있는 캠페인 인사이트 갯수 =', resultCampaignInfo.length);
    // console.log('비용이 있는 캠페인 인사이트 =', resultCampaignInfo);
    return result;
  } catch (err) {
    console.log(err.message);
  } finally {
    db.close();
  }
};
