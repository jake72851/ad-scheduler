const axios = require('axios');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');

// tiktok에서 정기적으로 region 정보 업데이트 필요
async function main() {
  for (const objectiveType of CONF.TIKTOK.REGION_OBJECT_TYPE) {
    const datas = {
      advertiser_id: CONF.TIKTOK.TEST_ADVERTISER_ID,
      placements: ['PLACEMENT_TIKTOK'],
      objective_type: objectiveType,
    };
    const config = {
      method: 'GET',
      url: CONF.TIKTOK.API + CONF.TIKTOK.API_REGION,
      headers: {
        'Access-Token': CONF.TIKTOK.ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      data: datas,
    };
    const result = await axios(config);
    console.log('region info result =', result.data.data.region_info);

    for (const item of result.data.data.region_info) {
      const vad = await db.connection(CONFDB.DB.NAME);
      const regionInfo = vad.collection(CONFDB.DB.TIKTOK.REGION);

      const data = {
        objectiveType,
        areaType: item.area_type,
        level: item.level,
        parentId: item.parent_id,
        nextLevelIds: item.next_level_ids,
        locationId: item.location_id,
        supportBelow18: item.support_below_18,
        regionCode: item.region_code,
        name: item.name,
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      await regionInfo.updateOne(
        {
          objectiveType: data.objectiveType,
          areaType: data.areaType,
          level: data.level,
          parentId: data.parentId,
          nextLevelIds: data.nextLevelIds,
          locationId: data.locationId,
          name: data.name,
        },
        { $set: data },
        { upsert: true }
      );
    }
  }
  db.close();
  console.log('region info update end!!!');
}

main();
