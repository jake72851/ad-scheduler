const db = require('../db/connect');
const CONFDB = require('../config/db');

// 틱톡 인증처리
exports.auth = async function (userId) {
  // console.log("google > userId =", userId)

  const vad = await db.connection(CONFDB.DB.NAME);
  const adAccountsInfo = vad.collection(CONFDB.DB.ACCOUNTS);
  // const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'facebook', status: 1 }).toArray();
  const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'tiktok', status: 1 }).toArray();

  let result = {};
  if (authInfoList.length === 0) {
    // api를 호출하기 위한 토큰 정보가 없다면
    // 인증처리요청 필요
  } else if (authInfoList.length === 1) {
    // api를 호출하기 위한 토큰 정보가 있다면
    result = {
      type: 'tiktok',
      advertiser_ids: authInfoList[0].advertiser_ids,
      user_id: userId,
    };
  } else if (authInfoList.length > 1) {
    // api를 호출하기 위한 토큰 정보가 여러개 있다면 인증정보 확인필요
  }

  return result;
};
