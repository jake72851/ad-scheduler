const axios = require('axios');
const CONF = require('../../../config/api');
const db = require('../../../db/connect');
const CONFDB = require('../../../config/db');

/*
  참고사항 : 누락이 있어 지속적인 확인 필요
  af / Afrikaans > 아프리칸스어 누락으로 수동 추가
  az / Azerbaijani > 아제르바이잔어 누락으로 수동 추가
  bg / Bulgarian > 불가리아어 누락으로 수동 추가
  bm / Bambara > 바말라어 누락으로 수동 추가
  bs / Bosnian > 보스니아어 누락으로 수동 추가
  ca / Catalan > 카탈로니아어 누락으로 수동 추가
  ceb / Cebuano > 세부아노어는 필리핀에서 사용되는 언어 누락으로 수동 추가
  da / Danish > 덴마크어 누락으로 수동 추가
  en-AU / English Australia > 영어 누락으로 수동 추가
  en-GB / English United Kingdom > 영어 누락으로 수동 추가
  en-SG / English Singapore > 영어 누락으로 수동 추가
  en-US / English United States > 영어 누락으로 수동 추가
  et / Estonian >  에스토니아어 누락으로 수동 추가
  fil / Filipino > 필리핀어 누락으로 수동 추가
  fa / Persian > 페르시아어 누락으로 수동 추가
  hr / Croatian > 크로아티아어 누락으로 수동 추가 
  in / Indonesian > 인도네시아어 누락으로 수동 추가 
  jv / Javanese > 자바어(자와어) 누락으로 수동 추가 
  kk / Kazakh > 카자흐어 누락으로 수동 추가 
  lo / Lao > 라오어 누락으로 수동 추가 
  lt / Lithuanian > 리투아니아어 누락으로 수동 추가 
  lv / Latvian > 라트비아어 누락으로 수동 추가 
  mg / Malagasy > 말라가시어(마다가스카르의 주요 언어) 누락으로 수동 추가 
  mk / Macedonian > 마케도니아어 누락으로 수동 추가 
  my / Mongolian > 몽골어 누락으로 수동 추가 
  ne / Nepali > 네팔어 누락으로 수동 추가
  nb / Norwegian bokmal > 노르웨이어 보크말 언어 누락으로 수동 추가
  sl / Slovenian > 슬로베니아어 누락으로 수동 추가
  sk / Slovak > 슬로바키아어 누락으로 수동 추가
  sw / Swahili > 스와힐리어 누락으로 수동 추가
  tl / Tagalog > 타갈로그어(필리핀의 공식 언어) 누락으로 수동 추가
  ur / Urdu > 우르두어 누락으로 수동 추가 
  uz / Uzbek > 우즈베키스탄어 누락으로 수동 추가 
  zh / Chinese > 중국어 누락으로 수동 추가
*/

// tiktok에서 정기적으로 region 정보 업데이트 필요
async function main() {
  const datas = {
    advertiser_id: CONF.TIKTOK.TEST_ADVERTISER_ID,
  };
  const config = {
    method: 'GET',
    url: CONF.TIKTOK.API + CONF.TIKTOK.API_LANGUAGE,
    headers: {
      'Access-Token': CONF.TIKTOK.ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: datas,
  };
  const result = await axios(config);
  console.log('language info result =', result.data.data.languages);

  for (const item of result.data.data.languages) {
    const vad = await db.connection(CONFDB.DB.NAME);
    const languageInfo = vad.collection(CONFDB.DB.TIKTOK.LANGUAGE);

    const data = {
      name: item.name,
      code: item.code,
      createdTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };
    await languageInfo.updateOne(
      {
        name: data.name,
        code: data.code,
      },
      { $set: data },
      { upsert: true }
    );
  }
  db.close();
  console.log('language info update end!!!');
}

main();
