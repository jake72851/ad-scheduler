const adsSdk = require('facebook-nodejs-business-sdk');
const CONF = require('../config/api');
const db = require('../db/connect');
const dayjs = require('dayjs');

// sdk 설정
const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
const api = adsSdk.FacebookAdsApi.init(accessToken);
const AdAccount = adsSdk.AdAccount;
const showDebugingInfo = false; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

exports.request = async function (userId, accountId, pageId) {
  const account = new AdAccount(accountId);
  const fileds = [
    // 🔒 = v13.0 혹은 이후버전에서만 엑세스 가능
    'automatic_matching_fields',
    'can_proxy', // proxy 가능여부?
    'code', // 웹 사이트에 배치할 픽셀 코드
    // 'config', 🔒
    'creation_time', // 픽셀이 생성된 시간
    'creator', // 이 픽셀을 만든 사용자
    'data_use_setting', // 픽셀 데이터를 사용하는 방법을 캡처하기 위한 설정
    // 'description', 🔒
    // 'duplicate_entries', 🔒
    // 'enable_auto_assign_to_accounts', 🔒
    'enable_automatic_matching', // ID 일치를 위해 픽셀에 대해 자동 고급 일치가 활성화되었는지 여부를 나타냅니다
    // 'event_stats', 🔒
    // 'event_time_max', 🔒
    // 'event_time_min', 🔒
    'first_party_cookie_status', // 이 픽셀에 자사 쿠키를 설정할 수 있는지 여부를 나타내는 자사 쿠키 상태
    'id', // 픽셀의 ID
    // 'is_consolidated_container', 🔒
    'is_created_by_business', // 플래그는 비즈니스에서 픽셀을 생성한 경우를 나타냅니다
    // 'is_crm',
    // 'is_mta_use', 🔒
    // 'is_restricted_use', 🔒
    // 'is_unavailable',
    'last_fired_time', // 픽셀이 마지막으로 실행된 시간
    // 'last_upload_app', 🔒
    // 'last_upload_app_changed_time', 🔒
    // 'match_rate_approx', 🔒
    // 'matched_entries', 🔒
    'name', // 픽셀의 이름
    'owner_ad_account', // 🔒 이 픽셀을 소유한 광고 계정
    'owner_business', // 이 픽셀을 소유한 비즈니스의 ID 또는 픽셀이 아직 비즈니스에서 소유권을 주장하지 않은 경우 null입니다
    // 'usage', 🔒
    // 'valid_entries' 🔒
  ];
  const params = {
    filtering: [{ field: 'ad.funding_page_id', value: pageId, operator: 'EQUAL' }],
  };
  let pixels = await account.getAdsPixels(fileds, params);
  console.log('pixels.length =', pixels.length);

  const result = []; // db업데이트 정보
  const ids = []; // insight용 pixel id 정보만 저장
  pixels.map((element) => result.push(element._data));
  pixels.map((element) => ids.push(element._data.id));
  // result.push(...pixels);
  // ids.push(...pixels.map((pixel) => pixel.id));

  while (pixels.hasNext()) {
    pixels = await pixels.next();
    pixels.map((element) => result.push(element._data));
    pixels.map((element) => ids.push(element._data.id));
    // result.push(...pixels);
    // ids.push(...pixels.map((pixel) => pixel.id));
  }

  const data = {
    pixels: result,
    createdDay: dayjs().format('YYYY-MM-DD'),
    createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
  };

  const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const userFacebook = vad.collection('user_' + userId + '_facebook');

  await userFacebook.updateOne({ apiId: 'pixel', createdDay: data.createdDay }, { $set: data }, { upsert: true });

  return ids;
  // return 'ok'
};
