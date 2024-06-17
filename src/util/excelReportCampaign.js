const adsSdk = require('facebook-nodejs-business-sdk');

// const db = require('../db/connect');
// const CONFDB = require('../config/db');
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
      const campaign = new Campaign(itemCampaigns.id);
      const fieldsInsight = fields;
      const paramsInsight = {
        time_range: { since: startDay, until: endDay },
      };
      const insights = await campaign.getInsights(fieldsInsight, paramsInsight);
      // console.log('캠페인 insights =', insights);

      const insightsResult = [];
      insights.map((element) => insightsResult.push(element._data));
      /*
      while (insights.hasNext()) {
        insights = await insights.next();
        insights.map((element) => insightsResult.push(element._data));
      }
      */
      // console.log('insightsResult =', insightsResult);

      const campaignInsight = { ...insightsResult[0] };
      // console.log('campaignInsight.campaign_name =', campaignInsight.campaign_name);

      // console.log('비용 O');
      // 동영상 3초이상 재생 / 앱 설치 처리
      if (campaignInsight.actions) {
        campaignInsight.video3secPlay = await excelReportVideo3sec.request(campaignInsight.actions);
        campaignInsight.appInstall = await excelReportAppInstall.request(campaignInsight.actions);
      } else {
        campaignInsight.video3secPlay = '';
        campaignInsight.appInstall = '';
      }
      // 앱 설치 당 비용 처리
      if (campaignInsight.cost_per_action_type) {
        campaignInsight.appInstallCost = await excelReportAppInstall.request(campaignInsight.cost_per_action_type);
      } else {
        campaignInsight.appInstallCost = '';
      }

      resultIds.push(campaignInsight.campaign_id);
      resultCampaignInfo.push(campaignInsight);
      /*
      const vad = await db.connection(CONFDB.DB.NAME);
      const excelReport = vad.collection(CONFDB.DB.REPORT.COLLECTION);

      const data = {
        userId: 'vibezone',
        apiId: 'campaigns',
        dataType: 'insight',
        adAccountId: accountId,
        campaignId: campaignInsight.campaign_id,
        campaignName: campaignInsight.campaign_name,
        data: campaignInsight,
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
          startDay: data.startDay,
          endDay: data.endDay,
        },
        { $set: data },
        { upsert: true }
      );
      */
    }
    const result = [resultIds, resultCampaignInfo];
    console.log('비용이 있는 캠페인 id =', resultIds);
    console.log('비용이 있는 캠페인 인사이트 갯수 =', resultCampaignInfo.length);
    return result;
  } catch (err) {
    console.log(err.message);
  } finally {
    // db.close();
  }
};
