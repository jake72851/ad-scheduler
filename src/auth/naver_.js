const { NAVER } = require('../config/api');
const API = require('../config/api');
const CryptoJS = require('crypto-js');

exports.getSignedHeader = function (apiUrl) {
  const timestamp = new Date().getTime();

  const secretKey = API.NAVER.API_SECRET;

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(timestamp + '.' + 'GET' + '.' + apiUrl);

  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);

  const header = {
    'X-API-KEY': NAVER.API_KEY,
    'X-API-SECRET': NAVER.API_SECRET,
    // FIX: customer id는 dynamic하게 바뀌어야 합니다.
    'X-CUSTOMER': NAVER.CUSTOMER_ID,
    'X-Signature': signature,
    'X-Timestamp': timestamp,
  };

  return header;
};
