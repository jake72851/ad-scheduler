const adsSdk = require('facebook-nodejs-business-sdk');
const dayjs = require('dayjs');
const db = require('../db/connect');

exports.request = async function (access_token, account_id, user_id) {
  const AdAccount = adsSdk.AdAccount;
  const api = adsSdk.FacebookAdsApi.init(access_token);
  //api.setDebug(true)

  const account = new AdAccount(account_id);

  /* 한개 필드만 존재
        "_fields": [
            "tracking_specs"
        ],
    */
  let pixels = await account.getTracking();
  //console.log('pixels_insight =', pixels)

  const result = []; //db업데이트 정보

  result.push(...pixels);

  while (pixels.hasNext()) {
    pixels = await pixels.next();
    result.push(...pixels);
  }

  const data = {
    pixels_insight: result,
    created_day: dayjs().format('YYYY-MM-DD'),
  };

  const Vad = await db.connection('vad'); //DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const user_facebook = Vad.collection('user_' + user_id + '_facebook');

  await user_facebook.updateOne({ api_id: 'adAccounts/id/pixel/report', adAccountId: account_id, created_day: data.created_day }, { $set: data }, { upsert: true });

  return 'ok';
};

/* 참고만
    const fields = [
        // 🔒 = v13.0 혹은 이후버전에서만 엑세스 가능
        'id',
        'name',
        'pixel_id',
        'event_sources',
        'event_trackings',
        'custom_conversion_trackings',
        'third_party_pixel_trackings',
        'ad_account'
    ]
    const params = {
        // 'include_custom_conversion': true,
        // 'include_third_party_pixel': true,
        // 'add_facebook': true,
        // 'add_google': true,
        // 'add_pinterest': true
    }
*/
