const CONF = require('../config/api');
const axios = require('axios');
const dayjs = require('dayjs');

const adaccount = require('./adaccount');
const campaign = require('./campaign');
const adset = require('./adset');
const ad = require('./ad');
const playable = require('./playable');

// 틱톡 api
exports.request = async function (authResult) {
  const userId = authResult.user_id;
  const advertiserIds = authResult.advertiser_ids;

  // 계정정보 확인
  const datas = {
    advertiser_ids: [advertiserIds],
    fields: [
      'telephone_number',
      'contacter',
      'currency',
      'cellphone_number',
      'timezone',
      'advertiser_id',
      'role',
      'company',
      'status',
      'description',
      'rejection_reason',
      'address',
      'name',
      'language',
      'industry',
      'license_no',
      'email',
      'license_url',
      'country',
      'balance',
      'create_time',
      'display_timezone',
      'owner_bc_id',
    ],
  };
  const config = {
    method: 'GET',
    url: CONF.TIKTOK.API + CONF.TIKTOK.API_ADACCOUNT_INFO,
    headers: {
      'Access-Token': CONF.TIKTOK.ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: datas,
  };
  const accountInfo = await axios(config);
  // console.log('계정정보 확인 =', accountInfo);
  // console.log('계정정보 확인 list =', accountInfo.data.data.list);
  /*
  계정정보 확인 list = [
    {
      status: 'STATUS_ENABLE',
      display_timezone: 'Asia/Seoul',
      address: '선릉로94길 7 덕우빌딩 B2',
      cellphone_number: '+82102*****95',
      create_time: 1665730214,
      company: 'vibrary(바이브러리)',
      contacter: 'vi**********리)',
      country: 'KR',
      industry: '292113',
      description: 'https://www.myvibrary.com',
      currency: 'KRW',
      license_url: null,
      timezone: 'Asia/Seoul',
      name: 'vibrary(바이브러리)1014',
      telephone_number: '+82102*****95',
      email: 'c******@***********',
      license_no: '',
      rejection_reason: null,
      advertiser_id: '7154256566110208001',
      balance: 0,
      role: 'ROLE_ADVERTISER',
      language: 'ko'
    }
  ]
  */

  for (const item of accountInfo.data.data.list) {
    // 오늘 날짜 기준 한달동안 insight 정보 호출
    let termDay;
    for (let i = 0; i < 1; i++) {
      termDay = dayjs().subtract(i, 'days').format('YYYY-MM-DD');
      // console.log('termDay =', termDay);

      // 광고계정 insight
      await adaccount.request(userId, item.advertiser_id, item.name, termDay);

      // 캠페인 insight
      await campaign.request(userId, item.advertiser_id, item.name, termDay);

      // AdSet insight
      await adset.request(userId, item.advertiser_id, item.name, termDay);

      // ad insight
      await ad.request(userId, item.advertiser_id, item.name, termDay);

      // playable reports는 data level이 없음 > 별도 처리
      for (const dimension of CONF.TIKTOK.DIMENSION_PLAYABLE) {
        await playable.request(userId, item.advertiser_id, item.name, termDay, dimension);
      }
    }
  }

  return 'ok';
};
