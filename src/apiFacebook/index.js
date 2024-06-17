// const CONF = require('../config/api');
// const account = require('./account');
// const campaign = require('./campaign');
// const adSet = require('./adSet');
// const ads = require('./ads');
const dayjs = require('dayjs');

const insightAccount = require('./insightAccount');
const insightCampaign = require('./insightCampaign');
// const insightCampaign2 = require('./insightCampaign2');
const insightAdSet = require('./insightAdSet');
const insightAd = require('./insightAd');

// result 관련 매핑 정보 적재
// const resultDB = require('../controllers/facebook/info/resultDB');

// const pixel = require('./pixel');
// const insightPixel = require('./insight_pixel');
// const insightPixelCode = require('./insight_pixel_code');

// 페이스북 api
exports.request = async function (authResult) {
  /*
    console.log('facebook > authResult =', authResult);
    facebook > authResult = {
      type: 'facebook',
      fb_ad_account_id: 'act_2607869862847972',
      user_id: 'noldam',
      fb_page_id
    }
  */

  const userId = authResult.user_id;
  const accountId = authResult.fb_ad_account_id;
  const pageId = authResult.fb_page_id;

  // await account.request(userId, accountId, pageId); // 계정 정보 확인
  // const campaignResult = await campaign.request(userId, accountId, pageId); // campaign 정보 확인
  // for (const itemCampaign of campaignResult) {
  //   await adSet.request(userId, accountId, itemCampaign.id, pageId); // adset 정보 확인
  // }
  // await ads.request(userId, accountId, pageId); // campaign 정보 확인

  // 오늘 날짜 기준 한달동안 insight 정보 호출
  let termDay;
  for (let i = 0; i < 1; i++) {
    termDay = dayjs().subtract(i, 'days').format('YYYY-MM-DD');
    // termDay = '2023-06-23';
    console.log('termDay =', termDay);
    // result 관련 매핑 정보 적재
    // await resultDB.request(userId, accountId, pageId, termDay);

    await insightAccount.request(userId, accountId, pageId, termDay); // 계정 insight 확인
    await insightCampaign.request(userId, accountId, pageId, termDay); // 계정 insight 확인
    await insightAdSet.request(userId, accountId, pageId, termDay); // adset에만 결과지표 정보 있음 > aggregation 통해 광고계정, 캠페인, 광고 결과지표 도출 예정
    await insightAd.request(userId, accountId, pageId, termDay); // ad insights
  }

  // await pixel.request(userId, accountId, pageId); // pixel info
  // await insightPixel.request(accessToken, itemAccount.id, userId); // pixel insights
  // for (const itemIds of pixelsId) {
  //   // pixel id 별로 처리해야 하는 항목들
  //   // await insightPixelCode.request(accessToken, itemAccount.id, userId, item_ids) //pixel code insights
  // }

  // 픽셀 인사이트 참고
  // https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#----------
  // }

  // const AdsInsights = adsSdk.AdsInsights;
  // const adsInsights = new AdsInsights(accountId);
  // // console.log('adsInsights =', adsInsights)
  // const adsInsights_fields = ['account_id', 'account_name', 'ad_id', 'ad_name']; // 정보가 없는 field의 경우 항목없음
  // const adsInsights_info = await adsInsights.read(adsInsights_fields);
  // console.log('adsInsights =', adsInsights)

  // const Business = adsSdk.Business;
  // const business = new Business(accountId);
  // console.log('business =', business)
  /*
        Business {
            _data: { id: 'act_2607869862847972' },
            _fields: [
                'block_offline_analytics',
                'collaborative_ads_managed_partner_business_info',
                'collaborative_ads_managed_partner_eligibility',
                'collaborative_ads_partner_premium_options',
                'created_by',
                'created_time',
                'extended_updated_time',
                'id',
                'is_hidden',
                'link',
                'name',
                'payment_account_id',
                'primary_page',
                'profile_picture_uri',
                'timezone_id',
                'two_factor_type',
                'updated_by',
                'updated_time',
                'verification_status',
                'vertical',
                'vertical_id'
            ],
            ...
        }
    */
  // const business_fields = ['id', 'name']; // 정보가 없는 field의 경우 항목없음
  // const business_info = await business.read(business_fields);
  // console.log('business_info =', business_info)
  /*
        Business {
            _data: { id: 'act_2607869862847972', name: 'V-Ad-Manage' }
        }
    */

  // const AdAccountUser = adsSdk.AdAccountUser;
  // const adAccountUser = new AdAccountUser(accountId);
  // console.log('adAccountUser =', adAccountUser)
  /*
        AdAccountUser {
            _data: { id: 'act_2607869862847972' },
            _fields: [ 'id', 'name', 'tasks' ],
            _changes: { id: 'act_2607869862847972' },
            ...
        }
    */
  // const adAccountUser_fields = ['id', 'name']; // 정보가 없는 field의 경우 항목없음
  // const adAccountUser_info = await adAccountUser.read(adAccountUser_fields);
  // console.log('adAccountUser_info =', adAccountUser_info)
  /*
        AdAccountUser {
            _data: { id: 'act_2607869862847972', name: 'V-Ad-Manage' },
            ...
        }
    */

  // const BusinessAdAccountRequest = adsSdk.BusinessAdAccountRequest;
  // const businessAdAccountRequest = new BusinessAdAccountRequest(accountId);
  // const businessAdAccountRequest_fields = ['id', 'name']; // 정보가 없는 field의 경우 항목없음
  // const businessAdAccountRequest_info = await businessAdAccountRequest.read(businessAdAccountRequest_fields);
  // console.log('businessAdAccountRequest_info =', businessAdAccountRequest_info)
  // const user_fields = ['id', 'name']
  // const user_list = await account.getOwnedAdAccounts(user_fields)
  // const user_list = await account.get
  // console.log('user_list =', user_list)

  // account.getInsights

  /*
    for (const itemAccount of customer_clients) { //광고계정 갯수만큼 처리 - 기본으로 하루정보만 저장하고 스케줄을 통해 지난 정보저장 예정
        //하위 계정정보 요청
        await account.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 예산정보 요청
        await budget.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 campaign 정보 요청
        await campaign.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 adgroup 정보 요청
        await ad_group.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 ad_group_ad 정보 요청
        await ad_group_ad.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 asset_set 정보 요청
        await asset_set.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 keyword_view 정보 요청
        await keyword_view.request(accessToken, userId, itemAccount.customer_client.id)

        //하위 계정 display_keyword_view 정보 요청
        await display_keyword_view.request(accessToken, userId, itemAccount.customer_client.id)

    }
    */

  return 'ok';
};
