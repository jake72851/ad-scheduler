const axios = require('../util/axios');
const CONF = require('../config/api');
const dayjs = require('dayjs');

const adaccount = require('./adaccount');
const campaign = require('./campaign');
const adgroup = require('./adgroup');
const creative = require('./creative');

// kakao api 호출
exports.request = async function (authResult) {
  const userId = authResult.user_id;
  const accessToken = authResult.access_token;

  // 각 api 호출후 결과 저장
  const header = {
    Authorization: 'Bearer ' + accessToken,
  };
  const adAccountsResult = await axios.request('GET', CONF.KAKAO.API + 'adAccounts', '', '', header);

  for (const itemAccount of adAccountsResult.content) {
    // 광고계정 갯수만큼 처리
    const headerAdAccountId = {
      Authorization: 'Bearer ' + accessToken,
      adAccountId: itemAccount.id,
    };

    // 광고계정별 상세
    const paramAdAccount = { adAccountId: itemAccount.id };
    const adAccount = await axios.request('GET', CONF.KAKAO.API + 'adAccounts/' + itemAccount.id, paramAdAccount, '', headerAdAccountId);
    // 광고계정별 실시간 잔액 보기
    const balance = await axios.request('GET', CONF.KAKAO.API + 'adAccounts/balance', '', '', headerAdAccountId);
    // 영업권 보기
    const bizRight = await axios.request('GET', CONF.KAKAO.API + 'adAccounts/bizRight', '', '', headerAdAccountId);
    // 카카오톡 채널 프로필 목록 보기
    const channel = await axios.request('GET', CONF.KAKAO.API + 'adAccounts/channel/profiles', '', '', headerAdAccountId);
    // 픽셀 & SDK 목록 보기
    const trackers = await axios.request('GET', CONF.KAKAO.API + 'adAccounts/trackers', '', '', headerAdAccountId);

    // 어제 날짜부터 31일 단위로 이전기간 insight 정보 호출
    // 1. 호출제한이 5초라 한번에 31일 단위로 처리
    // 2. 기간조회는 오늘은 불가능 (조회시 datePreset=TODAY 적용필요)
    // let termDay;
    // 오늘 날짜 가져오기
    // const today = dayjs();
    for (let i = 0; i < 1; i++) {
      const startDate = dayjs()
        .subtract((i + 1) * 30, 'days')
        .format('YYYYMMDD');
      const endDate = dayjs()
        .subtract(i * 30 + 1, 'days')
        .format('YYYYMMDD');
      console.log('startDate =', startDate);
      console.log('endDate =', endDate);

      // 광고계정 insight
      await adaccount.request(accessToken, userId, adAccount.id, adAccount.name, startDate, endDate);

      // 캠페인 insight
      // 캠페인 목록 보기
      const campaigns = await axios.request('GET', CONF.KAKAO.API + CONF.KAKAO.API_CAMPAIGN_LIST, '', '', headerAdAccountId);
      const campaignsIds = campaigns.content.map((row) => row.id);
      // 최대 5개 조회가능
      const campaignsIdArr = [];
      for (let i = 0; i < campaignsIds.length; i += 5) {
        campaignsIdArr.push(campaignsIds.slice(i, i + 5));
      }
      for (const itemCampaigns of campaignsIdArr) {
        const arrString = itemCampaigns.join(',');
        await campaign.request(accessToken, userId, adAccount.id, adAccount.name, startDate, endDate, arrString);
      }

      // adGroups insight > response에서 캠페인 정보가 출력되지 않기 때문에 캠페인 각각 for문으로 처리하여 캠페인 정보를 포함시킴
      for (const itemCampaign of campaigns.content) {
        // 광고그룹 목록 보기
        const param = { campaignId: itemCampaign.id };
        const adGroups = await axios.request('GET', CONF.KAKAO.API + CONF.KAKAO.API_ADGROUP_LIST, param, '', headerAdAccountId);
        const adGroupsIds = adGroups.content.map((row) => row.id);

        // 최대 20개 조회가능
        const adGroupsIdArr20ea = [];
        for (let i = 0; i < adGroupsIds.length; i += 20) {
          adGroupsIdArr20ea.push(adGroupsIds.slice(i, i + 20));
        }

        for (const itemAdGroups of adGroupsIdArr20ea) {
          const arrString = itemAdGroups.join(',');
          await adgroup.request(accessToken, userId, adAccount.id, adAccount.name, itemCampaign.id, itemCampaign.name, startDate, endDate, arrString);
        }

        // ad insight > response에서 adGroups 정보가 출력되지 않기 때문에 adGroups 각각 for문으로 처리하여 adGroups 정보를 포함시킴
        for (const itemAdGroup of adGroups.content) {
          const param = { adGroupId: itemAdGroup.id };
          const creatives = await axios.request('GET', CONF.KAKAO.API + CONF.KAKAO.API_CREATIVES_LIST, param, '', headerAdAccountId);
          const creativesIds = creatives.content.map((row) => row.id);

          // 최대 100개 조회가능
          const creativesIdArr100ea = [];
          for (let i = 0; i < creativesIds.length; i += 100) {
            creativesIdArr100ea.push(creativesIds.slice(i, i + 100));
          }

          for (const itemCreatives of creativesIdArr100ea) {
            const arrString = itemCreatives.join(',');
            await creative.request(accessToken, userId, adAccount.id, adAccount.name, itemCampaign.id, itemCampaign.name, itemAdGroup.id, itemAdGroup.name, startDate, endDate, arrString);
          }
        }
      }
    }
  }

  return 'ok';
};
