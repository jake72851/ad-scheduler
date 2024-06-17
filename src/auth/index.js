const db = require('../db/connect');
const CONFDB = require('../config/db');
const kakao = require('./kakao');
const kakaoKeyword = require('./kakaoKeyword');
const google = require('./google');
const facebook = require('./facebook');
const tiktok = require('./tiktok');
const naver = require('./naver');

// 매체별 계정정보 확인 후 토큰 등의 인증과정 처리
exports.request = async function (userId) {
  console.log('auth.request userId =', userId);

  const vad = await db.connection(CONFDB.DB.NAME);
  const adAccounts = vad.collection(CONFDB.DB.ACCOUNTS);

  const accountsList = await adAccounts.find({ user_id: userId, status: 1 }).toArray();
  // const accountsList = await adAccounts.find({ user_id: userId }).toArray();
  // console.log('accountsList =', accountsList);
  /*
    accountsList = [
      {
        "_id": {
          "$oid": "640fee3b49394a58da9c1750"
        },
        "user_id": "vibezone",
        "password": "$2b$08$jtifOvcTmds3xuPcrPbMyuF51QKeQzD3q0NG6lYeLH27aYGECFyPS",
        "company_name": "vibezone",
        "company_reg_num": "1234",
        "ga_properties": [],
        "__v": 0,
        "fb_page_id": "103823895540224",
        "fb_page_name": "바이브러리 - vibrary",
        "fb_pixel_id": "",
        "fb_pixel_name": "",
        "fb_ad_account_id": "act_309301737341584",
        "fb_business_id": "808787066700660",
        "auth_type": "facebook"
      },
      {
        "_id": {
          "$oid": "641d346afbb5520d63dcf04f"
        },
        "user_id": "vibezone",
        "company_name": "vibezone",
        "auth_type": "tiktok",
        "advertiser_ids": "7154256566110208001"
      },
      {
        "_id": {
          "$oid": "6448d6ef4fdf0a5094ed44d4"
        },
        "access_token": "ya29.a0AVvZVsrg99V1Humwan6pDzsKgBXMKaTwTBYr709bQ31jJkABqxf-myDDv1mtlfIkreWnCT87DR0BEpxh3tz6p2W2JhKxXNzzA9hFOQ84FHTMCQ1V0GpubvgFRXnsyHoF7bE7UOxztEPV9otUmaaQn5s9bgXyv_waCgYKAaESARESFQGbdwaIF3I_t5cTrf5TaYzyvJNtEA0166",
        "token_type": "bearer",
        "refresh_token": "ck9anXtmt0jRx3d7ffWe-35nNKm7vRPDDJghO--UCiolEQAAAYYqYXRn",
        "expires_in": 21599,
        "refresh_token_expires_in": 5183999,
        "user_id": "vibezone",
        "auth_type": "google",
        "createdAt": {
          "$date": "2023-02-07T05:32:51.483Z"
        },
        "status": 1
      }
    ]
  */

  const authResult = [];

  for (const item of accountsList) {
    // console.log('item.auth_type =', item.auth_type);

    if (item.auth_type === 'kakao') {
      // const checkResult = await kakao.auth(item.user_id, item.client_id, item.client_secret, item.code); // 광고주 카카오 계정
      const checkResult = await kakao.auth(item.user_id);
      // console.log("checkResult =", checkResult)
      authResult.push(checkResult);
    } else if (item.auth_type === 'kakao_keyword') {
      // const checkResult = await kakao.auth(item.user_id, item.client_id, item.client_secret, item.code); // 광고주 카카오 계정
      const checkResult = await kakaoKeyword.auth(item.user_id);
      // console.log("checkResult =", checkResult)
      authResult.push(checkResult);
    } else if (item.auth_type === 'google') {
      const checkResult = await google.auth(item.user_id);
      // console.log("checkResult =", checkResult)
      authResult.push(checkResult);
    } else if (item.auth_type === 'facebook') {
      // fb_page_id 가 있는 경우만 인사이트 가능
      if (item.fb_page_id && item.fb_ad_account_id) {
        const checkResult = await facebook.auth(item.user_id);
        // console.log("checkResult =", checkResult)
        authResult.push(checkResult);
      }
    } else if (item.auth_type === 'tiktok') {
      const checkResult = await tiktok.auth(item.user_id);
      // console.log("checkResult =", checkResult)
      authResult.push(checkResult);
    } else if (item.auth_type === 'naver') {
      const checkResult = await naver.auth(item.user_id);
      // console.log("checkResult =", checkResult)
      authResult.push(checkResult);
    }
    /* else {
      // 다른 매체들 추가 필요
      authResult.push({
        type: 'naver',
        access_token: 'bmBO5KQFTbxm_9P63vVPy5B-i5fC2cFAsa5Piu_XCinI2AAAAYY0-m7Z',
        user_id: 'Vadmin',
      });
    } */
  }
  console.log('authResult 광고계정들 정보 =', authResult);
  /*
  authResult = [
    {
      type: 'facebook',
      fb_page_id: '103823895540224',
      fb_ad_account_id: 'act_309301737341584',
      user_id: 'vibezone'
    },
    {
      type: 'tiktok',
      advertiser_ids: '7154256566110208001',
      user_id: 'vibezone'
    },
    {
      type: 'google',
      access_token: 'ya29.a0AVvZVsrg99V1Humwan6pDzsKgBXMKaTwTBYr709bQ31jJkABqxf-myDDv1mtlfIkreWnCT87DR0BEpxh3tz6p2W2JhKxXNzzA9hFOQ84FHTMCQ1V0GpubvgFRXnsyHoF7bE7UOxztEPV9otUmaaQn5s9bgXyv_waCgYKAaESARESFQGbdwaIF3I_t5cTrf5TaYzyvJNtEA0166',
      user_id: 'vibezone'
    }
  ]
  */
  console.log('auth ok');

  return authResult;
};
