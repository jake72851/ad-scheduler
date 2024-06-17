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

  const authResult = [];

  for (const item of accountsList) {
    // console.log('item.auth_type =', item.auth_type);

    if (item.auth_type === 'kakao') {
      const checkResult = await kakao.auth(item.user_id);
      authResult.push(checkResult);
    } else if (item.auth_type === 'kakao_keyword') {
      const checkResult = await kakaoKeyword.auth(item.user_id);
      authResult.push(checkResult);
    } else if (item.auth_type === 'google') {
      const checkResult = await google.auth(item.user_id);
      authResult.push(checkResult);
    } else if (item.auth_type === 'facebook') {
      // fb_page_id 가 있는 경우만 인사이트 가능
      if (item.fb_page_id && item.fb_ad_account_id) {
        const checkResult = await facebook.auth(item.user_id);
        authResult.push(checkResult);
      }
    } else if (item.auth_type === 'tiktok') {
      const checkResult = await tiktok.auth(item.user_id);
      authResult.push(checkResult);
    } else if (item.auth_type === 'naver') {
      const checkResult = await naver.auth(item.user_id);
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
  console.log('auth ok');

  return authResult;
};
