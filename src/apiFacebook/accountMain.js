const CONF = require('../config/api');
const axios = require('../util/axios');
const dayjs = require('dayjs');
const db = require('../db/connect');

// paging 처리 재귀함수
// function getNextPage(url, arr) {
//   console.log('페이스북 대표 계정정보 처리 다음페이지!!!');
//   axios
//     .get(url)
//     .then((res) => {
//       arr.push(res.adaccounts.data);
//       if (res.adaccounts.data.paging && res.adaccounts.data.paging.next) {
//         // 다음 페이지가 존재하는 경우 다음 페이지의 URL을 가져와서 처리합니다.
//         getNextPage(res.adaccounts.data.paging.next);
//       }
//       return arr;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

exports.request = async function () {
  const url = CONF.FACEBOOK.API;
  const accessToken = CONF.FACEBOOK.ACCESS_TOKEN;
  const params = {
    access_token: accessToken,
    fields: 'adaccounts{ id, name, account_status }, accounts{ business, id, name, username }',
  };
  const res = await axios.request('GET', url + 'me', params, '', '');

  // let result = res.adaccounts.data;
  // if (res.adaccounts.paging.next) {
  //   result = await getNextPage(res.adaccounts.paging.next, result);
  // }
  const vad = await db.connection('vad'); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const facebookMainAccount = vad.collection('ad_accounts_info_facebook');
  const data = {
    accounts: res.accounts.data,
    adAccounts: res.adaccounts.data,
    createdDay: dayjs().format('YYYY-MM-DD'),
    createdAt: new Date(dayjs().format('YYYY-MM-DD') + 'T00:00:00Z'),
  };
  await facebookMainAccount.updateOne({ apiId: 'accounts', createdDay: data.createdDay }, { $set: data }, { upsert: true });
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
