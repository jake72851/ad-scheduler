const { NAVER } = require('../config/api');

/**
 * @param {string} id - 모든 id값 대응 가능
 * @param {{since: string, until: string}} timeRange */
exports.generateNaverReportQuery = (id, timeRange) => {
  const query = {
    id,
    timeRange,
    fields: NAVER.FIELDS,
  };

  return query;
};
