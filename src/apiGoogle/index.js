// const db = require('../db/connect');
const CONF = require('../config/api');
// const CONFDB = require('../config/db');
// const { GoogleAdsApi, ResourceNames, enums, resources } = require('google-ads-api');
const { GoogleAdsApi } = require('google-ads-api');
const dayjs = require('dayjs');

const account = require('./account');
const budget = require('./budget');
const campaign = require('./campaign');
const adGroup = require('./adGroup');
const adGroupAd = require('./adGroupAd');
// const asset = require('./assetSet');
const keywordView = require('./keywordView');
// const displayKeywordView = require('./displayKeywordView');
const ga4 = require('./ga4');

// 구글 api 호출
exports.request = async function (accessToken, userId, ga4AccessToken) {
  console.log('google > userId =', userId);
  console.log('google > accessToken =', accessToken);
  console.log('google > ga4 accessToken =', ga4AccessToken);

  const termDay = '2023-03-23';
  // const termDay = dayjs().format('YYYY-MM-DD');

  // ga4 정보 요청
  await ga4.request(ga4AccessToken, userId, termDay);
  console.log('ga4 finish!!!');

  // GCP account : for-marketing / oauth id - vad
  const client = new GoogleAdsApi({
    client_id: CONF.GOOGLE.CLIENT_ID,
    client_secret: CONF.GOOGLE.CLINET_SECRET,
    developer_token: CONF.GOOGLE.DEVELOPER_TOKEN,
  });

  // access 가능한 계정정보 - 라이브러리 가이드 기본
  // const customers = await client.listAccessibleCustomers(accessToken);
  // console.log('customers =', customers)
  /*
    {
        resource_names: [
            'customers/1349188692', //구글 기본 계정
            'customers/5504598598', //manager 계정 - vplate 최상위 관리 계정
            'customers/2917897772'  //Test Account - 테스트계정이 포함될수 있음
        ]
    }
  */

  // manager 계정(vplate 최상위 관리 계정) 정보를 통해 정보를 조회할 하위 계정정보를 가져온다
  const customer5504598598 = client.Customer({
    customer_id: CONF.GOOGLE.LOGIN_CUSTOMER_ID,
    login_customer_id: CONF.GOOGLE.LOGIN_CUSTOMER_ID,
    refresh_token: accessToken,
  });
  // console.log('customer5504598598 =', customer5504598598)
  // 링크된 계정보를 가져올수 있으나 원하는 정보는 아니여서 특별히 아직 참조할 부부은 없음
  /*
    const customer_client_link = await customer5504598598.query(`
      SELECT 
          customer_client_link.client_customer, 
          customer_client_link.hidden, 
          customer_client_link.manager_link_id, 
          customer_client_link.resource_name, 
          customer_client_link.status, 
          customer.id, customer.manager, 
          customer.resource_name, 
          customer.status 
      FROM 
          customer_client_link
    `)
    console.log('customer_client_link =', customer_client_link)
  */
  /*
    [
      {
        customer_client_link: {
        client_customer: 'customers/5318998392',
        hidden: false,
        manager_link_id: 280596679,
        resource_name: 'customers/5504598598/customerClientLinks/5318998392~280596679',
        status: 2
        },
        customer: {
        id: 5504598598,
        manager: true,
        resource_name: 'customers/5504598598',
        status: 2
        }
      },
      {
        customer_client_link: {
        client_customer: 'customers/2917897772',
        hidden: false,
        manager_link_id: 281544894,
        resource_name: 'customers/5504598598/customerClientLinks/2917897772~281544894',
        status: 2
        },
        customer: {
        id: 5504598598,
        manager: true,
        resource_name: 'customers/5504598598',
        status: 2
        }
      }
    ]
  */

  // 최상위 관리계정에서 하위 계정정보만 가져오기
  const customerClients = await customer5504598598.query(`
    SELECT 
      customer_client.id, 
      customer_client.applied_labels, 
      customer_client.client_customer, 
      customer_client.currency_code, 
      customer_client.descriptive_name, 
      customer_client.hidden, 
      customer_client.level, 
      customer_client.manager, 
      customer_client.resource_name, 
      customer_client.status, 
      customer_client.test_account, 
      customer_client.time_zone, 
      customer.id, 
      customer.manager, 
      customer.resource_name, 
      customer.status, 
      customer.test_account 
    FROM 
      customer_client 
    WHERE 
      customer_client.manager = FALSE 
  `);
  console.log('customerClients =', customerClients);
  /*
    [
      {
        customer_client: {
          id: 2917897772,
          applied_labels: [],
          client_customer: 'customers/2917897772',
          currency_code: 'KRW',
          descriptive_name: 'Test Account',
          hidden: false,
          level: 1,
          manager: false,
          resource_name: 'customers/5504598598/customerClients/2917897772',
          status: 2,
          test_account: false,
          time_zone: 'Asia/Seoul'
        },
        customer: {
          id: 5504598598,
          manager: true,
          resource_name: 'customers/5504598598',
          status: 2,
          test_account: false
        }
      },
      {
        customer_client: {
          id: 5318998392,
          applied_labels: [],
          client_customer: 'customers/5318998392',
          currency_code: 'KRW',
          descriptive_name: '더브이플래닛 내부광고계정',
          hidden: false,
          level: 1,
          manager: false,
          resource_name: 'customers/5504598598/customerClients/5318998392',
          status: 2,
          test_account: false,
          time_zone: 'Asia/Seoul'
        },
        customer: {
          id: 5504598598,
          manager: true,
          resource_name: 'customers/5504598598',
          status: 2,
          test_account: false
        }
      },
    ]
  */

  // 광고계정 갯수만큼 처리 - 기본으로 하루정보만 저장하고 스케줄을 통해 지난 정보저장 예정
  // * 주의 : 기간별 검색시 select 절에 segments.date 포함시 데이터가 있는 경우만 출력됨. 필요에 따라 활용필요
  for (const itemAccount of customerClients) {
    let termDay;
    for (let i = 0; i < 1; i++) {
      termDay = dayjs().subtract(i, 'days').format('YYYY-MM-DD');
      termDay = '2023-03-23';
      console.log('termDay =', termDay);
      console.log('itemAccount.customer_client.id =', itemAccount.customer_client.id);

      // 광고계정 정보 요청
      await account.request(
        accessToken,
        userId,
        itemAccount.customer_client.id,
        itemAccount.customer_client.descriptive_name,
        termDay
      );

      // 광고계정 budget 정보 요청 - 계정단위에선 budget date 필터링 안됨
      await budget.request(
        accessToken,
        userId,
        itemAccount.customer_client.id,
        itemAccount.customer_client.descriptive_name
      );

      // campaign 정보 요청 - budget 정보포함
      await campaign.request(
        accessToken,
        userId,
        itemAccount.customer_client.id,
        itemAccount.customer_client.descriptive_name,
        termDay
      );

      // adgroup 정보 요청 - budget 정보 없음
      await adGroup.request(
        accessToken,
        userId,
        itemAccount.customer_client.id,
        itemAccount.customer_client.descriptive_name,
        termDay
      );

      // adGroupAd 정보 요청 - budget 정보 없음
      await adGroupAd.request(
        accessToken,
        userId,
        itemAccount.customer_client.id,
        itemAccount.customer_client.descriptive_name,
        termDay
      );

      // 하위 계정 asset 정보 요청 - 날짜별 요청처리는 에디 의견으로 pass
      // await asset.request(
      //   accessToken,
      //   userId,
      //   itemAccount.customer_client.id,
      //   itemAccount.customer_client.descriptive_name,
      //   termDay
      // );

      // keywordView 정보 요청
      await keywordView.request(
        accessToken,
        userId,
        itemAccount.customer_client.id,
        itemAccount.customer_client.descriptive_name,
        termDay
      );

      // 하위 계정 displayKeywordView 정보 요청
      // await displayKeywordView.request(accessToken, userId, itemAccount.customer_client.id, termDay);

      // ga4 정보 요청
      // ga4는 광고계정 레벨로 처리해야 할듯 > 일단 그냥 둠
      if (ga4AccessToken) {
        await ga4.request(ga4AccessToken, userId, termDay);
      }
    }
  }

  return 'ok';
};
