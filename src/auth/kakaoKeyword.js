const db = require('../db/connect');
// const axios = require('../util/axios');
// const kakao = require('../apiKakao');
// const CONF = require('../config/api');
const CONFDB = require('../config/db');

// 인증코드 요청
/*
async function requestCode(method, uri, param) {
  console.log('method =', method);
  console.log('uri =', uri);
  console.log('param =', param);
  try {
    rtn = await axios({
      method: method,
      url: uri,
      data: param,
    });
  } catch (err) {
    rtn = err.response;
  }
  return rtn.data;
}
*/

// 카카오인증처리
// exports.auth = async function (user_id, client_id, client_secret, code) {
exports.auth = async function (userId) {
  // console.log("user_id =", user_id)
  // console.log("client_id =", client_id)

  let authInfo;

  const vad = await db.connection(CONFDB.DB.NAME); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const adAccountsInfo = vad.collection(CONFDB.DB.ACCOUNTS);
  const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'kakao_keyword', status: 1 }).toArray();
  console.log('kakao_keyword > authInfoList =', authInfoList);
  /*
    [
      {
        _id: new ObjectId("63e07c8b94d86469521e8576"),
        access_token: 'pBQyZgfxvHQ8ckxOy9X8hYbvWm4zqP5omzdLvjyqCiolUQAAAYYk5oCC',
        token_type: 'bearer',
        refresh_token: 'W19ZThclXfE_CRWzjFvgNHbnkQCsU3AInDsuZxmTCiolUQAAAYYk5oCB',
        expires_in: 21599,
        refresh_token_expires_in: 5183999,
        user_id: 'Vadmin',
        auth_type: 'kakao',
        createdAt: 2023-02-06T04:05:31.399Z,
        status: 1
      }
    ]
  */

  if (authInfoList.length === 0) {
    // api를 호출하기 위한 토큰 정보가 없다면
    // 인증시작
    // ***프론트에서 인가용 code 수급 필요
    /*
      const uri = "https://kauth.kakao.com/oauth/authorize"
      const param = {
          grant_type: 'authorization_code',
          client_id: client_id,
          redirect_uri: 'http://localhost',
          response_type: 'code'
      }
      const result = await requestCode('GET', uri, param)
      console.log('result =', result)
    */
    // *** 프론트에서 인가용 code를 받았다면 -
    /*
    const token_uri = CONF.kakao.token_url;
    const token_data = {
      grant_type: 'authorization_code',
      client_id: client_id,
      redirect_uri: CONF.kakao.token_redirect_uri,
      code: code,
    };
    const token_header = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const result = await axios.request('POST', token_uri, '', token_data, token_header);
    console.log('token result =', result);
    */
    // if (result.error) {
    // 토큰처리시 에러가 있다면
    // return 'err token';
    /* 
        {
          error: 'invalid_grant',
          error_description: 'authorization code not found for code=K74KMToQ9NlpLgjUc5aphzXntJykb3MYVaQLXGTRkVuSHIE7o8A1gXl04q1bMtCHnUd5hQo9dNkAAAGGJFPvnQ',
          error_code: 'KOE320',
          user_id: 'Vadmin',
          auth_type: 'kakao',
          createdAt: 2023-02-06T03:45:57.235Z,
          status: 1
        }
      */
    // } else {
    //   // 토큰정상 처리시
    //   result.user_id = user_id;
    //   result.auth_type = 'kakao';
    //   result.createdAt = new Date();
    //   result.status = 1;
    // console.log('result =', result)
    /* 
        {
            access_token: '1AUQ0G_sLaYUCHjZK5DvyMqQuSjRbKu9HB9LYrrwCj11mgAAAYYWPEFA',
            token_type: 'bearer',
            refresh_token: 'Fg0FhgxOeV6l9XvqIlzENMtuymSSJ3dz6mM2dEZXCj11mgAAAYYWPEE-',
            expires_in: 21599,
            refresh_token_expires_in: 5183999
        }
      */
    /* 인증코드용 주소 참고
        https://kauth.kakao.com/oauth/authorize?client_id=f719d4cda6a97ba7d2727878005f2d8d&redirect_uri=http://localhost&response_type=code
      */
    // }
    // 위 처리에서 에러가 없다면 신규토큰 저장
    // const insertResult = await adAccountsInfo.insertOne(result);
    // console.log('Inserted documents =', insertResult)
    /*
            Inserted documents => {
                acknowledged: true,
                insertedId: new ObjectId("63dccc7861c1e039d1fbdf29")
            }
        */
    // 광고주 컬렉션 생성
    // const creatResult = await Vad.createCollection('user_' + user_id + '_kakao');
    // console.log('creatResult =', creatResult)
    /*
      Collection {
        s: {
          db: Db { s: [Object] },
          options: {
          raw: false,
          promoteLongs: true,
          promoteValues: true,
          promoteBuffers: false,
          ignoreUndefined: false,
          bsonRegExp: false,
          serializeFunctions: false,
          fieldsAsRaw: {},
          enableUtf8Validation: true,
          writeConcern: [WriteConcern],
          readPreference: [ReadPreference]
          },
          namespace: MongoDBNamespace { db: 'vad', collection: 'user_Vadmin_kakao' },
          pkFactory: { createPk: [Function: createPk] },
          readPreference: ReadPreference {
          mode: 'primary',
          tags: undefined,
          hedge: undefined,
          maxStalenessSeconds: undefined,
          minWireVersion: undefined
          },
          bsonOptions: {
          raw: false,
          promoteLongs: true,
          promoteValues: true,
          promoteBuffers: false,
          ignoreUndefined: false,
          bsonRegExp: false,
          serializeFunctions: false,
          fieldsAsRaw: {},
          enableUtf8Validation: true
          },
          readConcern: undefined,
          writeConcern: WriteConcern { w: 'majority' }
        }
      }
    */
    // 위에서 처리된 인증정보를 통하여 api 호출
    /*
      const api_result = await kakao.api_request(result.access_token, user_id)
      console.log('api_result =', api_result)
    */
    // auth_info = { type: 'kakao', access_token: result.access_token, user_id: user_id };
  } else if (authInfoList.length === 1) {
    // api를 호출하기 위한 토큰 정보가 있다면
    /*
      const api_result = await kakao.api_request(authInfoList[0].access_token, user_id)
      console.log('api_result =', api_result)
    */
    authInfo = { type: 'kakao_keyword', access_token: authInfoList[0].access_token, user_id: userId };
  } else if (authInfoList.length > 1) {
    // api를 호출하기 위한 토큰 정보가 여러개 있다면 인증정보 확인필요
  }

  return authInfo;
};
