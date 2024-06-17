const axios = require('axios');
const CONF = require('../config/api');
const db = require('../db/connect');
const CONFDB = require('../config/db');

async function main() {
  const headers = {
    Authorization:
      'Bearer ...',
    'developer-token': CONF.GOOGLE.DEVELOPER_TOKEN,
    'login-customer-id': CONF.GOOGLE.LOGIN_CUSTOMER_ID,
  };

  const selectFields = [
    'geo_target_constant.country_code',
    'geo_target_constant.id',
    'geo_target_constant.canonical_name',
    'geo_target_constant.name',
    'geo_target_constant.parent_geo_target',
    'geo_target_constant.resource_name',
    'geo_target_constant.status',
    'geo_target_constant.target_type',
  ];
  const selectFieldString = selectFields.join(', ');
  const data1 = {
    query: `
      SELECT 
        ${selectFieldString} 
      FROM 
        geo_target_constant 
    `,
  };
  const result = await axios.post(CONF.GOOGLE.API + '5318998392' + CONF.GOOGLE.API_END, data1, { headers });

  const vad = await db.connection(CONFDB.DB.NAME);
  const userGoogle = vad.collection(CONFDB.DB.GOOGLE.GEO);

  for (const item of result.data.results) {
    const data = {
      apiId: 'googleGeoInfo',
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),

      resourceName: item.geoTargetConstant.resourceName,
      status: item.geoTargetConstant.status,
      id: item.geoTargetConstant.id,
      name: item.geoTargetConstant.name,
      countryCode: item.geoTargetConstant.countryCode,
      targetType: item.geoTargetConstant.targetType,
      canonicalName: item.geoTargetConstant.canonicalName,
    };
    await userGoogle.updateOne(
      {
        apiId: data.apiId,
        id: data.id,
      },
      { $set: data },
      { upsert: true }
    );
  }
}

main();
