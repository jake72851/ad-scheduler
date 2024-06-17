// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const CONF = require('../../../../config/api');
// const { GoogleAdsApi, enums } = require('google-ads-api');
const axios = require('axios');

exports.request = async function (accessToken, userId, account) {
  const headers = {
    Authorization: 'Bearer ' + accessToken,
  };
  const result = await axios
    .get(CONF.GOOGLE.GA4_ADMIN + CONF.GOOGLE.GA4_ACCOUNT_PROPERTIES + account, { headers })
    .catch((error) => {
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
  // console.log('accounts properties =', result.data.properties);
  /*
    accounts properties = [
      {
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
      },
      {
        name: 'properties/274206677',
        parent: 'accounts/195910269',
        createTime: '2021-06-01T07:32:33.252Z',
        updateTime: '2021-12-25T03:49:11.922Z',
        displayName: 'vibrary-push',
        timeZone: 'Asia/Seoul',
        currencyCode: 'USD',
        serviceLevel: 'GOOGLE_ANALYTICS_STANDARD',
        account: 'accounts/195910269',
        propertyType: 'PROPERTY_TYPE_ORDINARY'
      },
    ]
  */

  return result.data.properties;
};
