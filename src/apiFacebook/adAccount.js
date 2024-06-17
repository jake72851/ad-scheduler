const CONF = require('../config/api');
const axios = require('../util/axios');
const dayjs = require('dayjs');
const db = require('../db/connect');

let accountCount = 1;
// paging 처리 재귀함수
function getNextPage(url, arr) {
  console.log('계정정보 다음페이지!!! =', accountCount);
  axios
    .get(url)
    .then((res) => {
      arr.push(res.adaccounts.data);
      if (res.adaccounts.data.paging && res.adaccounts.data.paging.next) {
        // 다음 페이지가 존재하는 경우 다음 페이지의 URL을 가져와서 처리합니다.
        getNextPage(res.adaccounts.data.paging.next);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  accountCount++;
}

// 관리 계정정보 확인
exports.request = async function (accessToken, userId) {
  // console.error('accessToken =', accessToken);
  // console.error('userId =', userId);
  const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const userFacebook = vad.collection('user_' + userId + '_facebook');

  const url = CONF.FACEBOOK.API;
  const params = {
    access_token: accessToken,
    fields: 'adaccounts{ id, name, account_status }',
  };
  const res = await axios.request('GET', url + 'me', params, '', '');

  let result = res.adaccounts.data;
  if (res.adaccounts.paging.next) {
    result = await getNextPage(res.adaccounts.paging.next, result);
  }
  const data = {
    ad_accounts: result,
    created_day: dayjs().format('YYYY-MM-DD'),
  };
  await userFacebook.updateOne({ api_id: 'adAccounts', created_day: data.created_day }, { $set: data }, { upsert: true });

  return result;
};

// console.log('res =', res);
/*
res = {
  adaccounts: {
    data: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    paging: { cursors: [Object] }
  },
  id: '118656753984593'
}
*/
