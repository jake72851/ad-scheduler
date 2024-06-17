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

/*
참고 : https://developers.facebook.com/docs/marketing-api/reference/ads-pixel/
pixels = [
  AdsPixel {
    _data: { id: '405217380297045', name: '이준호님의 픽셀' },
    _fields: [
      'automatic_matching_fields',
      'can_proxy',
      'code',
      'config',
      'creation_time',
      'creator',
      'data_use_setting',
      'description',
      'duplicate_entries',
      'enable_auto_assign_to_accounts',
      'enable_automatic_matching',
      'event_stats',
      'event_time_max',
      'event_time_min',
      'first_party_cookie_status',
      'id',
      'is_consolidated_container',
      'is_created_by_business',
      'is_crm',
      'is_mta_use',
      'is_restricted_use',
      'is_unavailable',
      'last_fired_time',
      'last_upload_app',
      'last_upload_app_changed_time',
      'match_rate_approx',
      'matched_entries',
      'name',
      'owner_ad_account',
      'owner_business',
      'usage',
      'valid_entries'
    ],
    _changes: { id: '405217380297045', name: '이준호님의 픽셀' },
    automatic_matching_fields: [Getter/Setter],
    can_proxy: [Getter/Setter],
    code: [Getter/Setter],
    config: [Getter/Setter],
    creation_time: [Getter/Setter],
    creator: [Getter/Setter],
    data_use_setting: [Getter/Setter],
    description: [Getter/Setter],
    duplicate_entries: [Getter/Setter],
    enable_auto_assign_to_accounts: [Getter/Setter],
    enable_automatic_matching: [Getter/Setter],
    event_stats: [Getter/Setter],
    event_time_max: [Getter/Setter],
    event_time_min: [Getter/Setter],
    first_party_cookie_status: [Getter/Setter],
    id: [Getter/Setter],
    is_consolidated_container: [Getter/Setter],
    is_created_by_business: [Getter/Setter],
    is_crm: [Getter/Setter],
    is_mta_use: [Getter/Setter],
    is_restricted_use: [Getter/Setter],
    is_unavailable: [Getter/Setter],
    last_fired_time: [Getter/Setter],
    last_upload_app: [Getter/Setter],
    last_upload_app_changed_time: [Getter/Setter],
    match_rate_approx: [Getter/Setter],
    matched_entries: [Getter/Setter],
    name: [Getter/Setter],
    owner_ad_account: [Getter/Setter],
    owner_business: [Getter/Setter],
    usage: [Getter/Setter],
    valid_entries: [Getter/Setter],
    _parentId: undefined,
    _api: FacebookAdsApi {
      accessToken: 'EAARBqMoR4BsBAEorGddQafvVe7B31sQLH1aVXeuZAksGovBQ6UG7MNdFKl86lhaBFqegvtv38M5bmcUGXC4vRkekEVCkHbjUR1I5FuF7ZB8agMRtY8KkNkTwjWnZAZABMFliM0TGZAZBWRZAOOZBw92wCA7WYrLgaVfe1PZAl3k6KOxvpAkxQZAN9AzRwYJVGTX9sIhMZBcZC4slgwZDZD',
      locale: 'en_US',
      _debug: true,
      _showHeader: false
    }
  },
  _api: FacebookAdsApi {
    accessToken: 'EAARBqMoR4BsBAEorGddQafvVe7B31sQLH1aVXeuZAksGovBQ6UG7MNdFKl86lhaBFqegvtv38M5bmcUGXC4vRkekEVCkHbjUR1I5FuF7ZB8agMRtY8KkNkTwjWnZAZABMFliM0TGZAZBWRZAOOZBw92wCA7WYrLgaVfe1PZAl3k6KOxvpAkxQZAN9AzRwYJVGTX9sIhMZBcZC4slgwZDZD',
    locale: 'en_US',
    _debug: true,
    _showHeader: false
  },
  _targetClass: [Function: AdsPixel],
  paging: {
    cursors: { before: 'NDA1MjE3MzgwMjk3MDQ1', after: 'NDA1MjE3MzgwMjk3MDQ1' }
  },
  clear: [Function (anonymous)],
  set: [Function (anonymous)],
  next: [Function (anonymous)],
  hasNext: [Function (anonymous)],
  previous: [Function (anonymous)],
  hasPrevious: [Function (anonymous)],
  _loadPage: [Function (anonymous)],
  _buildObjectsFromResponse: [Function (anonymous)],
  summary: undefined
]
*/
