const db = require('../db/connect');
// const axios = require('../util/axios');
// const kakao = require('../apiKakao');
// const CONF = require('../config/api');
const CONFDB = require('../config/db');

exports.auth = async function (userId) {
  // console.log("user_id =", user_id)
  // console.log("client_id =", client_id)

  let authInfo;

  const vad = await db.connection(CONFDB.DB.NAME);
  const adAccountsInfo = vad.collection(CONFDB.DB.ACCOUNTS);
  const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'naver', status: 1 }).toArray();
  // console.log('naver > authInfoList =', authInfoList);
  /*
    [
      {
        _id: new ObjectId("63e07c8b94d86469521e8576"),
        access_token: 'pBQyZgfxvHQ8ckxOy9X8hYbvWm4zqP5omzdLvjyqCiolUQAAAYYk5oCC',
        token_type: 'bearer',
        refresh_token: 'W19ZThclXfE_CRWzjFvgNHbnkQCsU3AInDsuZxmTCiolUQAAAYYk5oCB',
        expires_in: 21599,
        refresh_token_expires_in: 5183999,
        user_id: 'Vadmin',
        auth_type: 'kakao',
        createdAt: 2023-02-06T04:05:31.399Z,
        status: 1
      }
    ]
  */

  if (authInfoList.length === 0) {
    //
  } else if (authInfoList.length === 1) {
    // api를 호출하기 위한 토큰 정보가 있다면
    /*
      const api_result = await kakao.api_request(authInfoList[0].access_token, user_id)
      console.log('api_result =', api_result)
    */
    authInfo = { type: 'naver', customer_id: authInfoList[0].customer_id, user_id: userId };
  } else if (authInfoList.length > 1) {
    // api를 호출하기 위한 토큰 정보가 여러개 있다면 인증정보 확인필요
  }

  return authInfo;
};
