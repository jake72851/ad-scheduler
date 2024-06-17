// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const CONF = require('../../../../config/api');
// const { GoogleAdsApi, enums } = require('google-ads-api');
const axios = require('axios');

exports.request = async function (accessToken, userId, ga4Id) {
  const headers = {
    Authorization: 'Bearer ' + accessToken,
  };
  const result = await axios
    .get(CONF.GOOGLE.GA4_ADMIN + 'properties/' + ga4Id + '/googleAdsLinks', { headers })
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
  // console.log('googleAdsLinks =', result.data.googleAdsLinks);
  /*
  googleAdsLinks = [
    {
      name: 'properties/274206677/googleAdsLinks/3361795968',
      customerId: '3435230993',
      adsPersonalizationEnabled: true,
      createTime: '2022-03-23T07:07:51.990Z',
      updateTime: '2022-03-23T07:07:51.990Z',
      creatorEmailAddress: 'admin@vibezone.kr'
    }
  ]
  */

  return result.data.googleAdsLinks;
};
