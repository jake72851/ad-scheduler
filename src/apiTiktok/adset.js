// const axios = require('axios');
const CONF = require('../config/api');
// const db = require('../db/connect');
// const CONFDB = require('../config/db');

const basic = require('../controllers/tiktok/insight/basicAdset');
const audience = require('../controllers/tiktok/insight/audienceAdset');
const DSA = require('../controllers/tiktok/insight/DSAAdset');
const reservation = require('../controllers/tiktok/insight/reservationAdset');

exports.request = async function (userId, advertiserIds, advertiserName, termDay) {
  console.log(' ');
  console.log('termDay =', termDay);

  // basic report
  for (const item of CONF.TIKTOK.DIMENSION_BASIC) {
    await basic.request(userId, advertiserIds, advertiserName, termDay, item);
  }

  // Audience reports > gender, age, country_code, ac, language, platform, interest_category, placement, contextual_tag (cannot be used together with other audience dimensions)
  for (const item of CONF.TIKTOK.DIMENSION_AUDIENCE) {
    await audience.request(userId, advertiserIds, advertiserName, termDay, item);
  }

  // DSA reports
  for (const item of CONF.TIKTOK.DIMENSION_DSA) {
    await DSA.request(userId, advertiserIds, advertiserName, termDay, item);
  }

  // Reservation reports
  for (const item of CONF.TIKTOK.DIMENSION_RESERVATION) {
    await reservation.request(userId, advertiserIds, advertiserName, termDay, item);
  }
};
