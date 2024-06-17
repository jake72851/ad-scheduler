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
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (fields, startDay, endDay, accountId, breakdowns, objective) {
  try {
    const account = new AdAccount(accountId);

    const params = {
      level: 'account',
      time_range: { since: startDay, until: endDay },
      effective_status: ['ACTIVE'],
      breakdowns,
      // objective,
      filtering: [{ field: 'objective', operator: 'IN', value: [objective] }],
    };
    let insights = await account.getInsights(fields, params);
    const result = [];
    insights.map((element) => result.push(element._data));
    while (insights.hasNext()) {
      insights = await insights.next();
      insights.map((element) => result.push(element._data));
    }

    // 동영상 3초이상 재생, 앱 설치, 앱 설치 당 비용 처리
    for (const item of result) {
      if (item.actions) {
        item.video3secPlay = await excelReportVideo3sec.request(item.actions);
        item.appInstall = await excelReportAppInstall.request(item.actions);
      } else {
        item.video3secPlay = '';
        item.appInstall = '';
      }
      if (item.cost_per_action_type) {
        item.appInstallCost = await excelReportAppInstall.request(item.cost_per_action_type);
      } else {
        item.appInstallCost = '';
      }
      // ctr 이 없는 경우 예외 처리
      if (!item.ctr) {
        item.ctr = '0';
      }
    }
    /*
    const vad = await db.connection(CONFDB.DB.NAME);
    const excelReport = vad.collection(CONFDB.DB.REPORT.COLLECTION);

    const data = {
      userId: 'vibezone',
      apiId: 'adAccounts',
      dataType: 'insight',
      breakdowns,
      objective,
      adAccountId: accountId,
      data: result,
      startDay,
      endDay,
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };
    await excelReport.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        breakdowns: data.breakdowns,
        objective: data.objective,
        adAccountId: data.adAccountId,
        startDay: data.startDay,
        endDay: data.endDay,
      },
      { $set: data },
      { upsert: true }
    );
    */
    return result;
  } catch (err) {
    console.log(err.message);
  } finally {
    // db.close();
  }
};
