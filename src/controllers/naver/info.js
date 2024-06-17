const { default: axios } = require('axios');
const { getSignedHeader } = require('../../auth/naver_');
const { NAVER } = require('../../config/api');
const db = require('../../db/connect');
const CONFDB = require('../../config/db');

// NOTE: 계정의 모든 캠페인 정보를 불러옵니다.
exports.campaignList = async (userId, customerId, termDay) => {
  try {
    const Vad = await db.connection(CONFDB.DB.NAME);
    const userNaver = Vad.collection(CONFDB.DB.NAVER.COLLECTION);

    const headers = getSignedHeader('/ncc/campaigns');
    const result = await axios
      .get(`${NAVER.API}/ncc/campaigns`, {
        headers,
      })
      .then((data) => {
        return data.data;
      });

    if (!result) throw Error('no data defined');

    const data = {
      userId,
      api_id: 'campaigns',
      dataType: 'info',
      adAccountId: customerId,
      // NOTE: acAccountName이 해당 call로 제공되지 않아 일단 null로 두었습니다.
      adAccountName: null,
      data: result,
      createdDay: termDay,
      createdAt: new Date(termDay + 'T00:00:00Z'),
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };

    await userNaver.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        adAccountId: data.adAccountId,
        createdDay: termDay,
      },
      { $set: data },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

// NOTE: 계정의 모든 adGroupd 정보를 불러옵니다. ()
exports.adGroupList = async (userId, customerId, termDay) => {
  try {
    const Vad = await db.connection(CONFDB.DB.NAME);
    const userNaver = Vad.collection(CONFDB.DB.NAVER.COLLECTION);

    const headers = getSignedHeader('/ncc/adgroups');
    const result = await axios
      .get(`${NAVER.API}/ncc/adgroups`, {
        headers,
      })
      .then((data) => {
        return data.data;
      });

    if (!result) throw Error('no data defined');

    const data = {
      userId,
      api_id: 'adGroups',
      dataType: 'info',
      adAccountId: customerId,
      // NOTE: acAccountName이 해당 call로 제공되지 않아 일단 null로 두었습니다.
      adAccountName: null,
      data: result,
      createdDay: termDay,
      createdAt: new Date(termDay + 'T00:00:00Z'),
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };

    await userNaver.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        adAccountId: data.adAccountId,
        createdDay: termDay,
      },
      { $set: data },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.adsList = async (userId, customerId, termDay, adGroupId) => {
  try {
    const Vad = await db.connection(CONFDB.DB.NAME);
    const userNaver = Vad.collection(CONFDB.DB.NAVER.COLLECTION);

    const headers = getSignedHeader('/ncc/ads');
    const result = await axios
      .get(`${NAVER.API}/ncc/ads`, {
        params: {
          nccAdgroupId: adGroupId,
        },
        headers,
      })
      .then((data) => {
        return data.data;
      });

    if (!result) throw Error('no data defined');

    const data = {
      userId,
      api_id: 'ads',
      dataType: 'info',
      adAccountId: customerId,
      // NOTE: acAccountName이 해당 call로 제공되지 않아 일단 null로 두었습니다.
      adAccountName: null,
      adGroupId,
      data: result,
      createdDay: termDay,
      createdAt: new Date(termDay + 'T00:00:00Z'),
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };

    await userNaver.updateOne(
      {
        userId: data.userId,
        apiId: data.apiId,
        dataType: data.dataType,
        adAccountId: data.adAccountId,
        adGroupId: data.adGroupId,
        createdDay: termDay,
      },
      { $set: data },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};
