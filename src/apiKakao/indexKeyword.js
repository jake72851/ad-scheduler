// const db = require('../db/connect');
const axios = require('../util/axios');
const CONF = require('../config/api');
// const CONFDB = require('../config/db');
const dayjs = require('dayjs');

const adaccount = require('./adaccountKeyword');
const campaign = require('./campaignKeyword');
const adgroup = require('./adgroupKeyword');
const keyword = require('./keyword');
const creative = require('./creativeKeyword');

// kakao api 호출
exports.request = async function (authResult) {
  const userId = authResult.user_id;
  const accessToken = authResult.access_token;

  // 각 api 호출후 결과 저장
  const header = {
    Authorization: 'Bearer ' + accessToken,
  };

  // 광고계정목록 - 여러개 일수 있음
  const adAccountsResult = await axios.request('GET', CONF.KAKAO.API_KEYWORD + 'adAccounts', '', '', header);

  // 광고계정 갯수만큼 처리
  for (const itemAccount of adAccountsResult.content) {
    const headerAdAccountId = {
      Authorization: 'Bearer ' + accessToken,
      adAccountId: itemAccount.id,
    };

    // 광고계정별 상세
    const paramAdAccount = { adAccountId: itemAccount.id };
    const adAccount = await axios.request('GET', CONF.KAKAO.API_KEYWORD + 'adAccounts/' + itemAccount.id, paramAdAccount, '', headerAdAccountId);

    // 광고계정별 실시간 잔액 보기
    const balance = await axios.request('GET', CONF.KAKAO.API_KEYWORD + 'adAccounts/balance', '', '', headerAdAccountId);

    // 영업권 보기
    const bizRight = await axios.request('GET', CONF.KAKAO.API_KEYWORD + 'adAccounts/bizRight', '', '', headerAdAccountId);

    // 카카오톡 채널 프로필 목록 보기
    const channel = await axios.request('GET', CONF.KAKAO.API_KEYWORD + 'adAccounts/channel/profiles', '', '', headerAdAccountId);

    // 조회 제한 없는듯.
    for (let i = 0; i < 1; i++) {
      const termDay = dayjs().subtract(i, 'days').format('YYYYMMDD');

      // 광고계정 insight
      await adaccount.request(accessToken, userId, adAccount.id, adAccount.name, termDay);

      // 캠페인 insight
      await campaign.request(accessToken, userId, adAccount.id, adAccount.name, termDay);

      // 캠페인 목록 보기
      const campaigns = await axios.request('GET', CONF.KAKAO.API_KEYWORD + CONF.KAKAO.API_CAMPAIGN_LIST, '', '', headerAdAccountId);

      // adGroups insight > response에서 캠페인 정보가 출력되지 않기 때문에 캠페인 각각 for문으로 처리하여 캠페인 정보를 포함시킴
      for (const itemCampaign of campaigns) {
        // adgroup insight
        await adgroup.request(accessToken, userId, adAccount.id, adAccount.name, itemCampaign.id, itemCampaign.name, termDay);

        // 광고그룹 목록 보기
        const param = { campaignId: itemCampaign.id };
        const adGroups = await axios.request('GET', CONF.KAKAO.API_KEYWORD + CONF.KAKAO.API_ADGROUP_LIST, param, '', headerAdAccountId);

        // ad insight > response에서 adGroups 정보가 출력되지 않기 때문에 adGroups 각각 for문으로 처리하여 adGroups 정보를 포함시킴
        for (const itemAdGroup of adGroups) {
          // keyword insight
          await keyword.request(accessToken, userId, adAccount.id, adAccount.name, itemCampaign.id, itemCampaign.name, itemAdGroup.id, itemAdGroup.name, termDay);

          // creative insight
          await creative.request(accessToken, userId, adAccount.id, adAccount.name, itemCampaign.id, itemCampaign.name, itemAdGroup.id, itemAdGroup.name, termDay);
        }
      }
    }
  }

  return 'ok';
};
