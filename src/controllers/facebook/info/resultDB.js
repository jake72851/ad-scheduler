// objectives / optimization_goal / action_type 순서
const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');
// const dayjs = require('dayjs');
const axios = require('../../../util/axios');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const AdSet = adsSdk.AdSet;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

async function main() {
  const url = CONF.FACEBOOK.API;
  const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
  const params = {
    access_token: accessToken,
    fields: 'id,name,adaccounts{id,name}',
  };
  const adaccounts = await axios.request('GET', url + 'me', params, '', '');
  // console.log('adaccounts =', adaccounts);
  /*
  adaccounts = {
    id: '118656753984593',
    name: 'Vplate AD',
    adaccounts: {
      data: [
        [Object], [Object],
        [Object], [Object],
        [Object], [Object],
        [Object], [Object],
        [Object], [Object],
        [Object], [Object]
      ],
      paging: { cursors: [Object] }
    }
  }
  */
  // console.log('adaccounts.adaccounts.data =', adaccounts.adaccounts.data);
  /*
  adaccounts.adaccounts.data = [
    { id: 'act_249316102671741', name: '249316102671741' },
    { id: 'act_1625333530981147', name: 'bodeepsleep' },
    { id: 'act_2607869862847972', name: 'V-Ad-Manage' },
    { id: 'act_309301737341584', name: '309301737341584' },
    { id: 'act_591962252027915', name: 'Vplate AD' },
    { id: 'act_340614171234933', name: 'V-AD-platform' },
    { id: 'act_468940287930361', name: '비케이컴퍼니' },
    { id: 'act_447635526879964', name: 'pumpa-test' },
    { id: 'act_1026233301434354', name: 'SDK로 생성된 계정' },
    { id: 'act_514026197120660', name: '[V-AD] 테스트2' },
    { id: 'act_1007405943471241', name: '느리게걷기' },
    { id: 'act_5431669850225416', name: '브이플레이트 광고계정' }
  ]
  */
  for (const adaccountsItem of adaccounts) {
    const params = {
      access_token: accessToken,
      fields: 'id,name,adaccounts{id,name}',
    };
    const adaccounts = await axios.request('GET', url + adaccountsItem.id, params, '', '');
    // console.log('adaccounts =', adaccounts);
  }

  /*
  const account = new AdAccount(accountId);
  const fieldsAcc = [
    'id',
    'name',
    'campaign_id',
    'attribution_spec', // 기여 설정 (결과 지표 관련)
    'promoted_object', // 광고 게재 최적화 기준 (결과 지표 관련) > 이상하게 없는 경우가 있으며 라이브러리 사용시 데이터가 다르게 나옴
  ];
  const paramsAcc = {
    // time_range: { since: termDay, until: termDay },
    // filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let adSetsInfos = await account.getAdSets(fieldsAcc, paramsAcc);
  */
  // console.log('adSetsInfos =', adSetsInfos);
  /*
  adSetsInfos = [
    AdSet {
      _data: {
        id: '23854898355490456',
        name: '21_1',
        campaign_id: '23854898355020456',
        attribution_spec: [Array],
        promoted_object: [Object]
      },
    },
  ]
  */
  /*
  const adsetResult = [];
  adSetsInfos.map((element) => adsetResult.push(element._data));

  while (adSetsInfos.hasNext()) {
    adSetsInfos = await adSetsInfos.next();
    adSetsInfos.map((element) => adsetResult.push(element._data));
  }
  // console.log('adSetsInfos result =', adsetResult);
  const vad = await db.connection(CONFDB.DB.NAME);
  const facebookResultInfo = vad.collection(CONFDB.DB.FACEBOOK.RESULT_INFO);
  const data = {
    userId,
    apiId: 'adsetInfo',
    dataType: 'info',
    adAccountId: accountId,
    data: adsetResult,
    createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
  };
  await facebookResultInfo.updateOne(
    {
      userId: data.userId,
      apiId: data.apiId,
      dataType: data.dataType,
      adAccountId: data.adAccountId,
    },
    { $set: data },
    { upsert: true }
  );

  for (const item of adSetsInfos) {
    console.log('adSet id =', item.id);
    const url = CONF.FACEBOOK.API;
    const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
    const params = {
      access_token: accessToken,
      fields: 'objective,optimization_goal,actions',
      action_attribution_windows: '7d_click,1d_view',
      time_range: { since: termDay, until: termDay },
    };
    const res = await axios.request('GET', url + item.id + '/insights', params, '', '');
    console.log('adSet res =', res);
  }
  */
  //   const headers = {
  //     Authorization:
  //       'Bearer ya29.a0AWY7CkktIH1lkBsQ-ImpyO36smIOUYzH_n1-cdSfMmerIu4dRg7XLkDTH7yCMCRMccZnLNtCUTj6KPXvrfNjGgfTTZhEl3TuZ47c8K31SdmBnzMGznhX8sL4cSxYaV3TUsVX_vLTs__vPY1sUMr268KvR18xMrMaCgYKAWkSARESFQG1tDrphZLgW8m1NB6kvIVhhTWAAg0166',
  //     'developer-token': CONF.GOOGLE.DEVELOPER_TOKEN,
  //     'login-customer-id': CONF.GOOGLE.LOGIN_CUSTOMER_ID,
  //   };
  //   const selectFields = [
  //     'geo_target_constant.country_code',
  //     'geo_target_constant.id',
  //     'geo_target_constant.canonical_name',
  //     'geo_target_constant.name',
  //     'geo_target_constant.parent_geo_target',
  //     'geo_target_constant.resource_name',
  //     'geo_target_constant.status',
  //     'geo_target_constant.target_type',
  //   ];
  //   const selectFieldString = selectFields.join(', ');
  //   const data1 = {
  //     query: `
  //       SELECT
  //         ${selectFieldString}
  //       FROM
  //         geo_target_constant
  //     `,
  //   };
  //   const result = await axios.post(CONF.GOOGLE.API + '5318998392' + CONF.GOOGLE.API_END, data1, { headers });
  //   // console.log('result =', result);
  //   console.log('result.data.results =', result.data.results);

  //   for (const item of result.data.results) {
  //     const data = {
  //       apiId: 'googleGeoInfo',
  //       createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
  //       resourceName: item.geoTargetConstant.resourceName,
  //       status: item.geoTargetConstant.status,
  //       id: item.geoTargetConstant.id,
  //       name: item.geoTargetConstant.name,
  //       countryCode: item.geoTargetConstant.countryCode,
  //       targetType: item.geoTargetConstant.targetType,
  //       canonicalName: item.geoTargetConstant.canonicalName,
  //     };
  //     await userGoogle.updateOne(
  //       {
  //         apiId: data.apiId,
  //         id: data.id,
  //       },
  //       { $set: data },
  //       { upsert: true }
  //     );
  //   }
}

main();
