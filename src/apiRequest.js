const kakao = require('./apiKakao');
const kakaoKeyword = require('./apiKakao/indexKeyword');
const google = require('./apiGoogle');
const facebook = require('./apiFacebook');
const tiktok = require('./apiTiktok');
const naver = require('./apiNaver');

exports.request = async function (authResult) {
  // 각 광고주 별로 모든 매체별 인증정보를 받아와서 처리
  for (const itemAuth of authResult) {
    if (itemAuth.type === 'kakao') {
      console.log('kakao api request start💡 > itemAuth =', itemAuth);
      await kakao.request(itemAuth);
      //
    } else if (itemAuth.type === 'kakao_keyword') {
      console.log('kakao_keyword api request start💡 > itemAuth =', itemAuth);
      await kakaoKeyword.request(itemAuth);
      //
    } else if (itemAuth.type === 'google') {
      console.log('google api request start💡');
      await google.request(itemAuth.access_token, itemAuth.user_id, itemAuth.ga4);
      //
    } else if (itemAuth.type === 'facebook') {
      console.log('facebook api request start💡');
      // await facebook.request(itemAuth.access_token, itemAuth.user_id);
      await facebook.request(itemAuth);
      //
    } else if (itemAuth.type === 'tiktok') {
      console.log('tiktok api request start💡 > itemAuth =', itemAuth);
      // await facebook.request(itemAuth.access_token, itemAuth.user_id);
      await tiktok.request(itemAuth);
      //
    } else if (itemAuth.type === 'naver') {
      console.log('naver api request start💡 > itemAuth =', itemAuth);
      await naver.request(itemAuth);
    }
  }
  return 'api ok';
};