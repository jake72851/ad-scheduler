const db = require('../db/connect');
const CONFDB = require('../config/db');
const CONF = require('../config/api');
// const { GoogleAdsApi } = require('google-ads-api');
const axios = require('axios');

const accountsProperties = require('../controllers/google/GA4/info/accountsProperties');
const conversionEvents = require('../controllers/google/GA4/info/conversionEvents');
// const customMetrics = require('../controllers/google/GA4/info/customMetrics');
const googleAdsLinks = require('../controllers/google/GA4/info/googleAdsLinks');
/*
const eventName = require('../controllers/google/GA4/insight/eventName');
const campaignName = require('../controllers/google/GA4/insight/campaignName');
const firstUserCampaign = require('../controllers/google/GA4/insight/firstUserCampaign');
const firstUserSourceMedium = require('../controllers/google/GA4/insight/firstUserSourceMedium');
const googleAdsAccountName = require('../controllers/google/GA4/insight/googleAdsAccountName');
const googleAdsAdGroup = require('../controllers/google/GA4/insight/googleAdsAdGroup');
const googleAdsAdNetworkType = require('../controllers/google/GA4/insight/googleAdsAdNetworkType');
const googleAdsAdCampaign = require('../controllers/google/GA4/insight/googleAdsAdCampaign');
const googleAdsCreativeId = require('../controllers/google/GA4/insight/googleAdsCreativeId');
const googleAdsCustomerId = require('../controllers/google/GA4/insight/googleAdsCustomerId');
const googleAdsKeyword = require('../controllers/google/GA4/insight/googleAdsKeyword');
const googleAdsQuery = require('../controllers/google/GA4/insight/googleAdsQuery');
const sessionCampaign = require('../controllers/google/GA4/insight/sessionCampaign');
const sessionDefaultChannelGroup = require('../controllers/google/GA4/insight/sessionDefaultChannelGroup');
const sessionGoogleAdsAccountName = require('../controllers/google/GA4/insight/sessionGoogleAdsAccountName');
const sessionGoogleAdsAdGroup = require('../controllers/google/GA4/insight/sessionGoogleAdsAdGroup');
const sessionGoogleAdsAdNetworkType = require('../controllers/google/GA4/insight/sessionGoogleAdsAdNetworkType');
const sessionGoogleAdsCampaign = require('../controllers/google/GA4/insight/sessionGoogleAdsCampaign');
const sessionGoogleAdsCreative = require('../controllers/google/GA4/insight/sessionGoogleAdsCreative');
const sessionGoogleAdsCustomer = require('../controllers/google/GA4/insight/sessionGoogleAdsCustomer');
const sessionGoogleAdsKeyword = require('../controllers/google/GA4/insight/sessionGoogleAdsKeyword');
const sessionGoogleAdsQuery = require('../controllers/google/GA4/insight/sessionGoogleAdsQuery');
const sessionSource = require('../controllers/google/GA4/insight/sessionSource');
const sessionSourceMedium = require('../controllers/google/GA4/insight/sessionSourceMedium');
const source = require('../controllers/google/GA4/insight/source');
const sourceMedium = require('../controllers/google/GA4/insight/sourceMedium');
*/
const common = require('../controllers/google/GA4/insight/common');

// 구글 api 호출
exports.request = async function (accessToken, userId, termDay) {
  // console.log('ga4 accessToken =', accessToken);
  const headers = {
    Authorization: 'Bearer ' + accessToken,
  };
  const result = await axios.get(CONF.GOOGLE.GA4_ADMIN + 'accounts', { headers }).catch((error) => {
    // 오류 발생 시 오류 메시지 출력
    if (error.response) {
      // 응답이 도착한 경우
      console.log('응답 오류:', error.response.status);
      console.log('오류 메시지:', error.response.data);
      console.log('오류 메시지 details:', error.response.data.error.details);
      console.log('오류 메시지 details:', error.response.data.error.details[0].errors);
    } else if (error.request) {
      // 요청이 전송되지 않은 경우
      console.log('요청 오류:', error.request);
    } else {
      // 오류가 발생한 경우
      console.log('오류 메시지:', error.message);
    }
  });
  // console.log('accounts =', result.data.accounts);

  if (result.data && result.data.accounts.length > 0) {
    // 계정별 ga4 정보 조회
    for (const itemAccount of result.data.accounts) {
      const accountName = itemAccount.displayName;
      const str = itemAccount.name;
      const account = str.split('/');
      const accountId = account[1];
      const properties = await accountsProperties.request(accessToken, userId, accountId);

      const infoData = {};
      // 계정별 여러개 ga4 정보 존재 가능
      if (properties !== undefined && properties.length > 0) {
        for (const itemProperties of properties) {
          // console.log('itemProperties =', itemProperties);
          /*
            itemProperties = {
              name: 'properties/270771957',
              parent: 'accounts/195910269',
              createTime: '2021-04-29T06:58:36.854Z',
              updateTime: '2021-04-29T06:58:36.854Z',
              displayName: 'sites.google.com/vibezone.kr/vps',
              industryCategory: 'ARTS_AND_ENTERTAINMENT',
              timeZone: 'Asia/Seoul',
              currencyCode: 'KRW',
              serviceLevel: 'GOOGLE_ANALYTICS_STANDARD',
              account: 'accounts/195910269',
              propertyType: 'PROPERTY_TYPE_ORDINARY'
            }
          */
          infoData.properties = itemProperties;

          const str = itemProperties.name;
          const id = str.split('/');
          // console.log('id =', id);
          // id = [ 'properties', '274206677' ]
          const GA4Id = id[1];
          const displayName = itemProperties.displayName;

          // conversionEvents list 요청
          const conversion = await conversionEvents.request(accessToken, userId, GA4Id);
          if (conversion !== undefined && conversion.length > 0) {
            infoData.conversionEvents = conversion;
          }
          // googleAdsLinks list 요청
          const adsLinks = await googleAdsLinks.request(accessToken, userId, GA4Id);
          if (adsLinks !== undefined && adsLinks.length > 0) {
            infoData.googleAdsLinks = adsLinks;
          }

          const vad = await db.connection(CONFDB.DB.NAME);
          const userGoogle = vad.collection(CONFDB.DB.GOOGLE.COLLECTION);

          const data = {
            userId,
            apiId: 'GA4',
            dataType: 'info',
            adAccountId: accountId,
            adAccountName: accountName,
            data: infoData,
            createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
          };
          await userGoogle.updateOne(
            {
              userId: data.userId,
              apiId: data.apiId,
              dataType: data.dataType,
              adAccountId: data.adAccountId,
            },
            { $set: data },
            { upsert: true }
          );

          console.log(' ');
          console.log('GA4 start id =', GA4Id);

          // const insights = {};

          // UTM (이벤트 기반 // firstUser, session도 존재)
          const source = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'source' }],
                metrics: CONF.GOOGLE.GA4.UTM_METRICS_1,
                orderBys: [{ desc: true, metric: { metricName: 'activeUsers' } }],
              },
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'source' }],
                metrics: CONF.GOOGLE.GA4.UTM_METRICS_2,
              },
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'source' }],
                metrics: CONF.GOOGLE.GA4.UTM_METRICS_3,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            source,
            'source',
            displayName
          );

          for (const item of CONF.GOOGLE.GA4.UTM_DIMENSIONS) {
            const body = {
              requests: [
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.UTM_METRICS_1,
                },
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.UTM_METRICS_2,
                },
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.UTM_METRICS_3,
                },
              ],
            };
            await common.request(accessToken, userId, GA4Id, termDay, accountId, accountName, body, item, displayName);
          }

          // audience
          const country = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'country' }, { name: 'countryId' }],
                metrics: CONF.GOOGLE.GA4.AUDIENCE_1,
              },
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'country' }, { name: 'countryId' }],
                metrics: CONF.GOOGLE.GA4.AUDIENCE_2,
              },
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'country' }, { name: 'countryId' }],
                metrics: CONF.GOOGLE.GA4.AUDIENCE_3,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            country,
            'country',
            displayName
          );

          for (const item of CONF.GOOGLE.GA4.AUDIENCE_DIMENSIONS) {
            const body = {
              requests: [
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.AUDIENCE_1,
                },
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.AUDIENCE_2,
                },
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.AUDIENCE_3,
                },
              ],
            };
            await common.request(accessToken, userId, GA4Id, termDay, accountId, accountName, body, item, displayName);
          }

          // 획득
          // 1.사용자 획득
          for (const item of CONF.GOOGLE.GA4.TAKE_USER_DIMENSIONS) {
            const body = {
              requests: [
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.TAKE_USER_1,
                },
              ],
            };
            await common.request(accessToken, userId, GA4Id, termDay, accountId, accountName, body, item, displayName);
          }
          // 2.트래픽 획득
          for (const item of CONF.GOOGLE.GA4.TAKE_TRAFFIC_DIMENSIONS) {
            const body = {
              requests: [
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.TAKE_TRAFFIC_1,
                },
              ],
            };
            await common.request(accessToken, userId, GA4Id, termDay, accountId, accountName, body, item, displayName);
          }

          // 참여
          // 1. Page and Screens
          for (const item of CONF.GOOGLE.GA4.JOIN_PAGE_SCREENS_DIMENSIONS) {
            const body = {
              requests: [
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.JOIN_PAGE_SCREENS_1,
                },
              ],
            };
            await common.request(accessToken, userId, GA4Id, termDay, accountId, accountName, body, item, displayName);
          }
          // 2. 이벤트 - 하단에 더 많은 지표요청하는 부분 있음
          /*
          const eventName = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'eventName' }],
                metrics: CONF.GOOGLE.GA4.EVENT_NAME_1,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            eventName,
            'eventName',
            displayName
          );
          */
          // 3. 랜딩 페이지
          const pagePath = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'pagePath' }],
                metrics: CONF.GOOGLE.GA4.PAGE_PATH_1,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            pagePath,
            'pagePath',
            displayName
          );

          // 수익 창출
          // 1. 전자상거래 구매 (item name) / 전자상거래 구매 (item brand)
          for (const item of CONF.GOOGLE.GA4.ITEM_DIMENSIONS) {
            const body = {
              requests: [
                {
                  dateRanges: [{ startDate: termDay, endDate: termDay }],
                  dimensions: [{ name: item }],
                  metrics: CONF.GOOGLE.GA4.ITEM_1,
                },
              ],
            };
            await common.request(accessToken, userId, GA4Id, termDay, accountId, accountName, body, item, displayName);
          }
          // 2. 프로모션
          const itemPromotion = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [
                  { name: 'itemPromotionName' },
                  { name: 'itemPromotionCreativeName' },
                  { name: 'itemPromotionId' },
                ],
                metrics: CONF.GOOGLE.GA4.ITEM_PROMOTION_1,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            itemPromotion,
            'itemPromotion',
            displayName
          );

          // googleads 캠페인별 사용자획득
          const firstUserGoogleAdsCampaign = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'firstUserGoogleAdsCampaignName' }, { name: 'firstUserGoogleAdsCampaignId' }],
                metrics: CONF.GOOGLE.GA4.COMMON_1,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            firstUserGoogleAdsCampaign,
            'firstUserGoogleAdsCampaign',
            displayName
          );

          // 소스별 참여 리포트
          const sourceJoin = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'sessionSource' }, { name: 'firstUserSource' }],
                metrics: CONF.GOOGLE.GA4.COMMON_1,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            sourceJoin,
            'sessionSource, firstUserSource',
            displayName
          );

          // 이벤트별 리포트
          const eventName = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'eventName' }],
                metrics: CONF.GOOGLE.GA4.EVENT_NAME_2,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            eventName,
            'eventName',
            displayName
          );

          // 페이지별 리포트 - 참여에 unifiedScreenClass 관련 요청이 있으나 지표가 달라 breakdown을 unifiedScreenClass2로 지정
          const unifiedScreenClass = {
            requests: [
              {
                dateRanges: [{ startDate: termDay, endDate: termDay }],
                dimensions: [{ name: 'unifiedScreenClass' }],
                metrics: CONF.GOOGLE.GA4.COMMON_1,
              },
            ],
          };
          await common.request(
            accessToken,
            userId,
            GA4Id,
            termDay,
            accountId,
            accountName,
            unifiedScreenClass,
            'unifiedScreenClass2',
            displayName
          );

          /*
          // eventName
          await eventName.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // campaignName
          await campaignName.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // firstUserCampaign
          await firstUserCampaign.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // firstUserSourceMedium
          await firstUserSourceMedium.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsAccountName
          await googleAdsAccountName.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsAdGroup
          await googleAdsAdGroup.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsAdNetworkType
          await googleAdsAdNetworkType.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsAdCampaign
          await googleAdsAdCampaign.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsCreativeId
          await googleAdsCreativeId.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsCustomerId
          await googleAdsCustomerId.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsKeyword
          await googleAdsKeyword.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // googleAdsQuery
          await googleAdsQuery.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionCampaign
          await sessionCampaign.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionDefaultChannelGroup
          await sessionDefaultChannelGroup.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsAccountName
          await sessionGoogleAdsAccountName.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsAdGroup
          await sessionGoogleAdsAdGroup.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsAdNetworkType
          await sessionGoogleAdsAdNetworkType.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsCampaign
          await sessionGoogleAdsCampaign.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsCreative
          await sessionGoogleAdsCreative.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsCustomer
          await sessionGoogleAdsCustomer.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsKeyword
          await sessionGoogleAdsKeyword.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionGoogleAdsQuery
          await sessionGoogleAdsQuery.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionSource
          await sessionSource.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sessionSourceMedium
          await sessionSourceMedium.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          await source.request(accessToken, userId, GA4Id, termDay, accountId, accountName);

          // sourceMedium
          await sourceMedium.request(accessToken, userId, GA4Id, termDay, accountId, accountName);
          */
          // console.log('GA4 insights =', insights);
        }
      }
    }
  }
  /*
  // device 기준 요청
  await deviceInsight.request(accessToken, userId, customerId, customerName, termDay);
  // age 기준 요청
  await ageInsight.request(accessToken, userId, customerId, customerName, termDay);
  // gender 기준 요청
  await genderInsight.request(accessToken, userId, customerId, customerName, termDay);
  // geo 기준 요청
  await geoInsight.request(accessToken, userId, customerId, customerName, termDay);

  // bidding strategy 요청 - 데이터는 확인 못함 (광고계정 기준으로는 데이터가 없는듯함)
  await biddingStrategyInsight.request(accessToken, userId, customerId, customerName, termDay);

  // result 가준요청
  await resultInsight.request(accessToken, userId, customerId, customerName, termDay);

  // budget 가준요청
  await budget.request(accessToken, userId, customerId, customerName, termDay);
  */
};
/*
  accounts: [
    {
      name: 'accounts/127781916',
      createTime: '2018-10-19T01:48:07.187Z',
      updateTime: '2018-10-19T01:48:07.187Z',
      displayName: 'jalnoneun',
      regionCode: 'KR'
    },
    {
      name: 'accounts/186452851',
      createTime: '2021-01-04T09:31:05.852Z',
      updateTime: '2021-01-04T09:31:05.852Z',
      displayName: '바딥슬립',
      regionCode: 'KR'
    },
    {
      name: 'accounts/191128881',
      createTime: '2021-03-04T01:23:29.764Z',
      updateTime: '2021-03-04T01:23:29.764Z',
      displayName: 'saltandchocolate',
      regionCode: 'KR'
    },
    {
      name: 'accounts/195868173',
      createTime: '2021-04-29T01:31:30.716Z',
      updateTime: '2021-04-29T01:31:30.716Z',
      displayName: 'nollab',
      regionCode: 'KR'
    },
    {
      name: 'accounts/196177480',
      createTime: '2021-05-04T07:26:55.860Z',
      updateTime: '2022-03-08T04:42:55.718Z',
      displayName: '오모가리컴퍼니',
      regionCode: 'KR'
    },
    {
      name: 'accounts/207653247',
      createTime: '2021-09-15T05:07:47.336Z',
      updateTime: '2021-10-26T04:20:01.434Z',
      displayName: 'milkypint',
      regionCode: 'KR'
    },
    {
      name: 'accounts/215796989',
      createTime: '2021-12-23T09:41:42.861Z',
      updateTime: '2021-12-23T09:41:42.861Z',
      displayName: 'dment',
      regionCode: 'KR'
    },
    {
      name: 'accounts/215857260',
      createTime: '2021-12-24T04:46:02.751Z',
      updateTime: '2021-12-24T04:46:02.751Z',
      displayName: 'kiwigo_GA',
      regionCode: 'KR'
    },
    {
      name: 'accounts/220124764',
      createTime: '2022-02-11T09:22:34.414Z',
      updateTime: '2022-02-11T09:22:34.414Z',
      displayName: 'bkcompany',
      regionCode: 'KR'
    },
    {
      name: 'accounts/221904590',
      createTime: '2022-03-03T03:19:30.030Z',
      updateTime: '2022-03-03T03:19:30.030Z',
      displayName: 'Typeof',
      regionCode: 'KR'
    },
    {
      name: 'accounts/236836804',
      createTime: '2022-08-08T06:56:30.529Z',
      updateTime: '2022-08-08T06:56:30.529Z',
      displayName: 'V AD',
      regionCode: 'KR'
    },
    {
      name: 'accounts/241431106',
      createTime: '2022-09-16T03:57:51.452Z',
      updateTime: '2022-09-16T03:57:51.452Z',
      displayName: 'VPLATE',
      regionCode: 'KR'
    },
    {
      name: 'accounts/242789455',
      createTime: '2022-09-26T08:02:41.008Z',
      updateTime: '2022-09-26T08:02:41.008Z',
      displayName: 'V AD - Megabox',
      regionCode: 'KR'
    }
  ]
*/
