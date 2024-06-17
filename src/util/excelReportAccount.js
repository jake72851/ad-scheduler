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

exports.request = async function (fields, startDay, endDay, accountId) {
  try {
    const account = new AdAccount(accountId);

    const params = {
      level: 'account',
      time_range: { since: startDay, until: endDay },
    };
    const insights = await account.getInsights(fields, params);
    // console.log('광고계정 insights =', insights);

    const insightsResult = [];
    insights.map((element) => insightsResult.push(element._data));
    /*
    while (insights.hasNext()) {
      insights = await insights.next();
      insights.map((element) => insightsResult.push(element._data));
    }
    */
    // console.log('insightsResult =', insightsResult);

    const accountInsight = { ...insightsResult[0] };

    // 동영상 3초이상 재생, 앱 설치 처리
    if (accountInsight.actions) {
      accountInsight.video3secPlay = await excelReportVideo3sec.request(accountInsight.actions);
      accountInsight.appInstall = await excelReportAppInstall.request(accountInsight.actions);
    } else {
      accountInsight.video3secPlay = '';
      accountInsight.appInstall = '';
    }
    // 앱 설치 당 비용 처리
    if (accountInsight.cost_per_action_type) {
      accountInsight.appInstallCost = await excelReportAppInstall.request(accountInsight.cost_per_action_type);
    } else {
      accountInsight.appInstallCost = '';
    }
    /*
    const vad = await db.connection(CONFDB.DB.NAME);
    const excelReport = vad.collection(CONFDB.DB.REPORT.COLLECTION);

    const data = {
      userId: 'vibezone',
      apiId: 'adAccounts',
      dataType: 'insight',
      adAccountId: accountId,
      data: accountInsight,
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
        startDay: data.startDay,
        endDay: data.endDay,
      },
      { $set: data },
      { upsert: true }
    );
    */
    return accountInsight;
  } catch (err) {
    console.log(err.message);
  } finally {
    // db.close();
  }
};
