const db = require('./src/db/connect');
const auth = require('./src/auth');
const api = require('./src/apiRequest');
const CONF = require('./src/config/db');
const dayjs = require('dayjs');

async function main() {
  const vad = await db.connection(CONF.DB.NAME);
  const user = vad.collection(CONF.DB.USERS);

  // 스케줄링할 활성화된 광고주 정보가져오기
  const userList = await user.find({ status: 1 }).toArray();

  /*
    활성화된 광고주들의 각 매체별 계정정보를 조회
    api 호출을 위한 인증처리 -> 신규인증 및 인증정보 저장 / 인증갱신 및 인증정보 업데이트
    광고주 매체별 컬렉션 생성
    인증된 정보를 통하여 각 매체별 api 호출 및 광고데이터 저장
  */

  const startTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log('시작시간 =', startTime);

  // 광고주 계정갯수만큼 실행
  for (const itemUser of userList) {
    console.log('itemUser.user_id =', itemUser.user_id);
    const authResult = await auth.request(itemUser.user_id); // 해당 user_id의 매체별 인증처리
    await api.request(authResult); // 인증정보를 통한 각 매체별 api 호출
  }

  console.log('시작시간 =', startTime);
  console.log('종료시간 =', dayjs().format('YYYY-MM-DD HH:mm:ss'));
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => db.close());