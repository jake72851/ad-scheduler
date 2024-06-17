const { default: axios } = require('axios');
const { getSignedHeader } = require('../../auth/naver_');
const { NAVER } = require('../../config/api');
const { convertToQueryString } = require('../../util/convertQueryString');
const db = require('../../db/connect');
const CONFDB = require('../../config/db');
const CONF = require('../../config/api');

// NOTE: 해당 지표가 같이 들어가면 conflict 납니다 자세한 사항은 notion 참조
// 'recentAvgCpc' 'recentAvgRnk'

/**
 * 쿼리 정보를 처리하는 함수입니다.
 * @param {Object} query - 쿼리 객체
 * @param {string} query.id - 쿼리 ID
 * @param {Object} query.timeRange - 시간 범위 객체
 * @param {string} query.timeRange.since - 시작 일자 "YYYY-MM-DD"
 * @param {string} query.timeRange.until - 종료 일자 "YYYY-MM-DD"
 * @param {FieldType[]} query.fields - 필드 배열
 * @param {string} apiId - api종류
 *
 * @description field의 경우 json string형식으로 인코딩해서 넣어주어야합니다.
 */
exports.campaignReport = async (query, userId, customerId, campaignId, campaignName, termDay) => {
  const Vad = await db.connection(CONFDB.DB.NAME);
  const userNaver = Vad.collection(CONFDB.DB.NAVER.COLLECTION);

  try {
    // breakdown 조최
    for (let i = 0; i < CONF.NAVER.BREAKDOWN.length; i++) {
      const params = convertToQueryString(query);
      const headers = getSignedHeader('/stats');
      const result = await axios
        .get(`${NAVER.API}/stats?${params}`, {
          headers,
        })
        .then((res) => res.data.data[0]);

      const data = {
        userId,
        apiId: 'campaigns',
        dataType: 'insight',
        adAccountId: customerId,
        campaignId,
        campaignName,
        breakdowns: null,
        data: result,
        createdDay: termDay,
        createdAt: new Date(termDay + 'T00:00:00Z'),
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      if (CONF.NAVER.BREAKDOWN[i] !== 'null') {
        data.breakdowns = CONF.NAVER.BREAKDOWN[i];
      }

      await userNaver.updateOne(
        {
          userId: data.userId,
          apiId: data.apiId,
          dataType: data.dataType,
          adAccountId: data.adAccountId,
          campaignId: data.campaignId,
          breakdowns: data.breakdowns,
          createdDay: data.createdDay,
        },
        { $set: data },
        { upsert: true }
      );

      // console.log('breakdowns =', CONF.NAVER.BREAKDOWN[i]);
    }

    // return 'ok';
  } catch (error) {
    console.log(error);
  }
};

exports.adGroupReport = async (query, userId, customerId, campaignId, adGroupId, adGroupName, termDay) => {
  const Vad = await db.connection(CONFDB.DB.NAME);
  const userNaver = Vad.collection(CONFDB.DB.NAVER.COLLECTION);

  try {
    // breakdown 조최
    for (let i = 0; i < CONF.NAVER.BREAKDOWN.length; i++) {
      const params = convertToQueryString(query);
      const headers = getSignedHeader('/stats');
      const result = await axios
        .get(`${NAVER.API}/stats?${params}`, {
          headers,
        })
        .then((res) => res.data.data[0]);

      const data = {
        userId,
        apiId: 'adGroups',
        dataType: 'insight',
        adAccountId: customerId,
        campaignId,
        adGroupId,
        adGroupName,
        breakdowns: null,
        data: result,
        createdDay: termDay,
        createdAt: new Date(termDay + 'T00:00:00Z'),
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      if (CONF.NAVER.BREAKDOWN[i] !== 'null') {
        data.breakdowns = CONF.NAVER.BREAKDOWN[i];
      }

      await userNaver.updateOne(
        {
          userId: data.userId,
          apiId: data.apiId,
          dataType: data.dataType,
          adAccountId: data.adAccountId,
          campaignId: data.campaignId,
          adGroupId: data.adGroupId,
          breakdowns: data.breakdowns,
          createdDay: data.createdDay,
        },
        { $set: data },
        { upsert: true }
      );

      // console.log('breakdowns =', CONF.NAVER.BREAKDOWN[i]);
    }

    // return 'ok';
  } catch (error) {
    console.log(error);
  }
};

exports.adReport = async (query, userId, customerId, campaignId, adGroupId, adId, adName, termDay) => {
  const Vad = await db.connection(CONFDB.DB.NAME);
  const userNaver = Vad.collection(CONFDB.DB.NAVER.COLLECTION);

  try {
    // breakdown 조최
    for (let i = 0; i < CONF.NAVER.BREAKDOWN.length; i++) {
      const params = convertToQueryString(query);
      const headers = getSignedHeader('/stats');
      const result = await axios
        .get(`${NAVER.API}/stats?${params}`, {
          headers,
        })
        .then((res) => res.data.data[0]);

      const data = {
        userId,
        apiId: 'ads',
        dataType: 'insight',
        adAccountId: customerId,
        campaignId,
        adGroupId,
        adId,
        adName,
        breakdowns: null,
        data: result,
        createdDay: termDay,
        createdAt: new Date(termDay + 'T00:00:00Z'),
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      if (CONF.NAVER.BREAKDOWN[i] !== 'null') {
        data.breakdowns = CONF.NAVER.BREAKDOWN[i];
      }

      await userNaver.updateOne(
        {
          userId: data.userId,
          apiId: data.apiId,
          dataType: data.dataType,
          adAccountId: data.adAccountId,
          campaignId: data.campaignId,
          adGroupId: data.adGroupId,
          adId: data.adId,
          breakdowns: data.breakdowns,
          createdDay: data.createdDay,
        },
        { $set: data },
        { upsert: true }
      );

      // console.log('breakdowns =', CONF.NAVER.BREAKDOWN[i]);
    }

    // return 'ok';
  } catch (error) {
    console.log(error);
  }
};
