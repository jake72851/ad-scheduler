// const db = require('../db/connect');
// const CONFDB = require('../config/db');
const CONF = require('../../../../config/api');
// const { GoogleAdsApi, enums } = require('google-ads-api');
const axios = require('axios');

exports.request = async function (accessToken, userId, ga4Id) {
  const headers = {
    Authorization: 'Bearer ' + accessToken,
  };
  const result = await axios.get(CONF.GOOGLE.GA4 + 'properties/' + ga4Id + '/conversionEvents', { headers }).catch((error) => {
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
  console.log('conversionEvents =', result.data.conversionEvents);
  /*
  conversionEvents = [
    {
      name: 'properties/274206677/conversionEvents/2633956370',
      eventName: 'app_store_subscription_convert',
      createTime: '2021-06-02T03:11:20.392909Z'
    },
    {
      name: 'properties/274206677/conversionEvents/2633956371',
      eventName: 'app_store_subscription_renew',
      createTime: '2021-06-02T03:11:20.392909Z'
    },
  ]
   */

  return result.data.conversionEvents;
};
