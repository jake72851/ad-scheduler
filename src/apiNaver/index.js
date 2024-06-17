const { campaignList, adGroupList, adsList } = require('../controllers/naver/info');
const { campaignReport, adGroupReport, adReport } = require('../controllers/naver/report');
const { generateNaverReportQuery } = require('../util/generateNaverReportQuery');
const dayjs = require('dayjs');

exports.request = async function (authResult) {
  console.log('naver start!!');
  // console.log('authResult =', authResult);
  // authResult = { type: 'naver', customer_id: '1887997', user_id: 'vad' }
  let termDay;
  for (let i = 0; i < 1; i++) {
    termDay = dayjs().subtract(i, 'days').format('YYYY-MM-DD');
    await campaignList(authResult.user_id, authResult.customer_id, termDay).then(async (campaigns) => {
      try {
        for (const campaign of campaigns) {
          // console.log('campaign =', campaign);
          /*
          campaign = {
            nccCampaignId: 'cmp-a001-06-000000005755733',
            customerId: 1887997,
            name: '플레이스#2',
            userLock: true,
            campaignTp: 'PLACE',
            deliveryMethod: 'ACCELERATED',
            trackingMode: 'TRACKING_DISABLED',
            usePeriod: false,
            dailyBudget: 20000,
            useDailyBudget: true,
            totalChargeCost: 0,
            status: 'PAUSED',
            statusReason: 'CAMPAIGN_PAUSED',
            expectCost: 0,
            migType: 0,
            delFlag: false,
            regTm: '2022-08-30T02:00:15.000Z',
            editTm: '2022-11-17T00:54:02.000Z'
          }
          */
          // const query = generateNaverReportQuery(nccCampaignId, { since: '2022-10-01', until: '2022-10-01' });
          const query = generateNaverReportQuery(campaign.nccCampaignId, { since: termDay, until: termDay });
          // console.log('query =', query);
          /*
          query = {
            id: 'cmp-a001-06-000000005755733',
            timeRange: { since: '2023-07-17', until: '2023-07-17' },
            fields: [
              'impCnt',      'clkCnt',
              'salesAmt',    'ctr',
              'cpc',         'avgRnk',
              'ccnt',        'pcNxAvgRnk',
              'mblNxAvgRnk', 'crto',
              'convAmt',     'ror',
              'cpConv',      'viewCnt'
            ]
          }
          */
          await campaignReport(
            query,
            authResult.user_id,
            authResult.customer_id,
            campaign.nccCampaignId,
            campaign.name,
            termDay
          );
        }
      } catch (error) {
        console.log(error);
      }
    });

    await adGroupList(authResult.user_id, authResult.customer_id, termDay).then(async (adgroups) => {
      try {
        // NOTE: ad info들을 호출하는 반복문
        for (const adgroup of adgroups) {
          // console.log('adgroup =', adgroup);
          /*
          adgroup = {
            nccAdgroupId: 'grp-a001-04-000000029504690',
            customerId: 1887997,
            nccCampaignId: 'cmp-a001-04-000000005852245',
            mobileChannelId: 'bsn-a001-00-000000007502800',
            pcChannelId: 'bsn-a001-00-000000007502800',
            bidAmt: 70,
            name: '1_2_브이플레이트_브랜드검색_MO',
            userLock: false,
            useDailyBudget: false,
            useKeywordPlus: false,
            useCloseVariant: true,
            keywordPlusWeight: 100,
            contentsNetworkBidAmt: 70,
            useCntsNetworkBidAmt: false,
            mobileNetworkBidWeight: 100,
            pcNetworkBidWeight: 100,
            dailyBudget: 0,
            budgetLock: false,
            delFlag: false,
            regTm: '2022-09-30T11:53:53.000Z',
            editTm: '2022-10-07T04:32:05.000Z',
            targetSummary: {},
            pcChannelKey: 'https://vplate.io',
            mobileChannelKey: 'https://vplate.io',
            status: 'ELIGIBLE',
            statusReason: 'ELIGIBLE',
            expectCost: 0,
            migType: 0,
            adgroupAttrJson: {
              campaignTp: 4,
              templateName: '모바일 라이트형 썸네일',
              media: 'MOBILE',
              templateId: 'schm-81riis0b'
            },
            adRollingType: 'ROUND_ROBIN',
            adgroupType: 'BRAND_SEARCH',
            systemBiddingType: 'NONE',
            useCntsNetworkBidWeight: false,
            contentsNetworkBidWeight: 100,
            sharedBudgetLock: false
          }
          */

          // console.log('adgroup.nccCampaignId =', adgroup.nccCampaignId);
          // console.log('adgroup.nccAdgroupId =', adgroup.nccAdgroupId);

          const query = generateNaverReportQuery(adgroup.nccAdgroupId, { since: termDay, until: termDay });
          // console.log('query =', query);
          /*
          query = {
            id: 'grp-a001-01-000000028857349',
            timeRange: { since: '2023-07-17', until: '2023-07-17' },
            fields: [
              'impCnt',      'clkCnt',
              'salesAmt',    'ctr',
              'cpc',         'avgRnk',
              'ccnt',        'pcNxAvgRnk',
              'mblNxAvgRnk', 'crto',
              'convAmt',     'ror',
              'cpConv',      'viewCnt'
            ]
          }
          */
          await adGroupReport(
            query,
            authResult.user_id,
            authResult.customer_id,
            adgroup.nccCampaignId,
            adgroup.nccAdgroupId,
            adgroup.name,
            termDay
          );

          await adsList(authResult.user_id, authResult.customer_id, termDay, adgroup.nccAdgroupId).then(async (ads) => {
            // NOTE: ad report들을 호출하는 반복문
            for (const ad of ads) {
              // console.log('ad =', ad);
              /*
              ad = {
                nccAdId: 'nad-a001-04-000000206069030',
                nccAdgroupId: 'grp-a001-04-000000029504690',
                customerId: 1887997,
                inspectStatus: 'APPROVED',
                type: 'BRAND_SEARCH_AD',
                ad: {
                  dittoId: 'crtv-rjm8vwj7o9kq',
                  thumbnail: 'https://ssl.pstatic.net/adimg2.search/o/tachikoma/rjm/crtv-rjm8vwj7o9kq.png'
                },
                adAttr: {},
                name: '브이플레이트_브랜드검색_MO',
                targetsMap: {
                  PERIOD_TARGET: {
                    nccTargetId: 'tgt-a001-04-000000337523192',
                    ownerId: 'nad-a001-04-000000206069030',
                    targetTp: 'PERIOD_TARGET',
                    target: null,
                    delFlag: false,
                    editTm: 1665537404000,
                    delTm: null,
                    regTm: 1665537404000,
                    targetJson1: null,
                    targetJson2: null
                  },
                  TIME_WEEKLY_TARGET: {
                    nccTargetId: 'tgt-a001-04-000000337523191',
                    ownerId: 'nad-a001-04-000000206069030',
                    targetTp: 'TIME_WEEKLY_TARGET',
                    target: null,
                    delFlag: false,
                    editTm: 1665537404000,
                    delTm: null,
                    regTm: 1665537404000,
                    targetJson1: null,
                    targetJson2: null
                  }
                },
                targetSummary: { period: 'all', week: 'all', time: 'all' },
                targets: [
                  {
                    nccTargetId: 'tgt-a001-04-000000337523191',
                    ownerId: 'nad-a001-04-000000206069030',
                    targetTp: 'TIME_WEEKLY_TARGET',
                    target: null,
                    delFlag: false,
                    regTm: '2022-10-12T01:16:44.000Z',
                    editTm: '2022-10-12T01:16:44.000Z'
                  },
                  {
                    nccTargetId: 'tgt-a001-04-000000337523192',
                    ownerId: 'nad-a001-04-000000206069030',
                    targetTp: 'PERIOD_TARGET',
                    target: null,
                    delFlag: false,
                    regTm: '2022-10-12T01:16:44.000Z',
                    editTm: '2022-10-12T01:16:44.000Z'
                  }
                ],
                userLock: false,
                enable: true,
                referenceKey: 'crtv-rjm8vwj7o9kq',
                delFlag: false,
                regTm: '2022-10-12T01:16:44.000Z',
                editTm: '2022-10-12T03:57:09.000Z',
                status: 'ELIGIBLE',
                statusReason: 'ELIGIBLE'
              }
              */

              // console.log('ad.nccAdgroupId =', ad.nccAdgroupId);

              const query = generateNaverReportQuery(ad.nccAdId, { since: termDay, until: termDay });
              // console.log('query =', query);

              await adReport(
                query,
                authResult.user_id,
                authResult.customer_id,
                adgroup.nccCampaignId,
                ad.nccAdgroupId,
                ad.nccAdId,
                ad.name,
                termDay
              );
            }
          });
        }
      } catch (error) {
        console.log(error);
      }

      console.log('end');
    });
  }
};

// apiId: campaigns
// breakdown: null
// createdDay: "2023-xx-xx"
// dataType: "info"
// userId: "vibezone"
// adAccountName: customerName
// createdAt: Date(2023-xx-xx)
// createdTime: new Date()
// data: 전체데이터{}[]
