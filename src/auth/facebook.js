const db = require('../db/connect');
const CONFDB = require('../config/db');

// 페이스북 인증처리
exports.auth = async function (userId) {
  // console.log("google > userId =", userId)
  const vad = await db.connection(CONFDB.DB.NAME);
  const adAccountsInfo = vad.collection(CONFDB.DB.ACCOUNTS);
  const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'facebook', status: 1 }).toArray();
  // const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'facebook' }).toArray();

  let result = {};
  if (authInfoList.length === 0) {
    // api를 호출하기 위한 토큰 정보가 없다면
    // 인증처리요청 필요
  } else if (authInfoList.length === 1) {
    // api를 호출하기 위한 토큰 정보가 있다면
    result = {
      type: 'facebook',
      fb_page_id: authInfoList[0].fb_page_id,
      fb_ad_account_id: authInfoList[0].fb_ad_account_id,
      user_id: userId,
    };
  } else if (authInfoList.length > 1) {
    // api를 호출하기 위한 토큰 정보가 여러개 있다면 인증정보 확인필요
  }

  return result;
};

// console.log('facebook > authInfoList =', authInfoList);
/*
facebook > authInfoList = [
  {
    _id: new ObjectId("61c4441f3b0ab1c144b745d2"),
    company_name: '(주)잘노는',
    company_reg_num: '4988600633',
    password: '$2b$08$cec3OIprC9NON.0uy57mhu81kBE3NDHB5xRpwkm9F7Xao83YWbY9y',
    user_id: 'noldam',
    service_name: '놀담',
    campaign_ids: [
      '23849218444840516',
      '23849153173180516',
      '23849153071430516',
      '23849152579170516'
    ],
    fb_business_id: '1642264509200708',
    updatedAt: 2022-01-25T05:34:27.204Z,
    fb_page_id: '931960673546240',
    fb_page_name: '놀담',
    ga_properties: [ [Object] ],
    report: { overall: 'aaa', plan: 'bbb', done: 'ccc', goal: 'dddd' },
    fb_ad_account_id: 'act_2607869862847972',
    auth_type: 'facebook'
  }
]
*/
