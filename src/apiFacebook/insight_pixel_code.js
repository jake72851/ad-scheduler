const bizSdk = require('facebook-nodejs-business-sdk')
const dayjs = require("dayjs")
const db = require('../db/connect')

const logApiCallResult = (apiCallName, data) => {
    console.log(apiCallName);
    if (showDebugingInfo) {
        console.log('logApiCallResult Data:' + JSON.stringify(data))
    }
}

exports.request = async function (access_token, account_id, user_id, pixels_id) {
    const AdsPixel = bizSdk.AdsPixel

    const api = bizSdk.FacebookAdsApi.init(access_token)
    const showDebugingInfo = true; // Setting this to true shows more debugging info.
    if (showDebugingInfo) {
        api.setDebug(true)
    }

    let fields, params;
    fields = [
        'code',
    ];
    params = {
    };
    // const sample_code = (new AdsPixel(id)).get(
    //     fields,
    //     params
    // )
    let res = await (new AdsPixel(pixels_id)).get()
    console.log('adAccounts/id/pixel/code res =', res)
    //logApiCallResult('sample_code api call complete.', sample_code);

    const result = []//db업데이트 정보

    result.push(...res)
    
    while ( res.hasNext() ) {
        res = await res.next()
        result.push(...res)
    }

    const data = {
        pixels_insight_code: result,
        created_day: dayjs().format('YYYY-MM-DD'),
    }

    const Vad = await db.connection('vad') //DB이름을 지정하지 않으면 첫번째DB로 지정됨
    const user_facebook = Vad.collection('user_' + user_id + '_facebook')

    await user_facebook.updateOne( {api_id: 'adAccounts/id/pixel/report/code', adAccountId: account_id, created_day: data.created_day}, {$set: data}, { upsert: true } )
  
    return 'ok'

}

/*
AdsPixel {
  _data: { id: '405217380297045' },
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
  _changes: {},
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
}
*/