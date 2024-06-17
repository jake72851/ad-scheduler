const axios = require('axios');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');

// tiktok에서 정기적으로 region 정보 업데이트 필요
async function main() {
  for (let i = 1; i < 3; i++) {
    const datas = {
      advertiser_id: CONF.TIKTOK.TEST_ADVERTISER_ID,
      version: i,
    };
    const config = {
      method: 'GET',
      url: CONF.TIKTOK.API + CONF.TIKTOK.API_CATEGORY,
      headers: {
        'Access-Token': CONF.TIKTOK.ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      data: datas,
    };
    const result = await axios(config);
    console.log('interest_category info result =', result.data.data.interest_categories);

    for (const item of result.data.data.interest_categories) {
      const vad = await db.connection(CONFDB.DB.NAME);
      const categoryInfo = vad.collection(CONFDB.DB.TIKTOK.CATEGORY);

      const data = {
        version: i,
        interestCategoryId: item.interest_category_id,
        specialIndustries: item.special_industries,
        subCategoryIds: item.sub_category_ids,
        placements: item.placements,
        interestCategoryName: item.interest_category_name,
        level: item.level,
        createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      };
      await categoryInfo.updateOne(
        {
          version: data.version,
          interestCategoryId: data.interestCategoryId,
        },
        { $set: data },
        { upsert: true }
      );
    }
  }
  db.close();
  console.log('interest_category info update end!!!');
}

main();
