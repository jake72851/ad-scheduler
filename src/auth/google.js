const db = require('../db/connect');
const CONFDB = require('../config/db');
const CONF = require('../config/api');

const http = require('http');
const url = require('url');
// const open = require('open');
// const destroyer = require('server-destroy');
const { OAuth2Client } = require('google-auth-library');

const axios = require('axios');

const clientId = CONF.GOOGLE.CLIENT_ID;
const clientSecret = CONF.GOOGLE.CLINET_SECRET;
const redirectUri = CONF.GOOGLE.REDIRECT_URI;
// const client = new OAuth2Client(clientId);

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    console.log(`ticket : ${ticket}`);
    const payload = ticket.getPayload();
    const userId = payload.sub;
    console.log(`User ID: ${userId}`);
    return true;
  } catch (error) {
    // 토큰이 유효하지 않은 경우 처리
    // console.error('error =', error);
    /*
    error = Error: Wrong number of segments in token: ya29.a0AWY7CkkUW2_gK9XCZZqZGlAqsyYcE3WNk_1pUmCLR6zKKeO9Nw4ZUz3h1TwgRx9hI6zbGh2Y2TopiMUMNSKph8EOrzN_H_7RcCXaCddavvHlEKWGGU0MM5Rfn5i9XoTdzg_U3MihUaNOdJKyGI4HfoZGWR600-YaCgYKAecSARESFQG1tDrpjilPoUNhwX6hUmZESEQ1Tw0166
    at OAuth2Client.verifySignedJwtWithCertsAsync (/Users/oriman/github/vad_scheduler/node_modules/google-auth-library/build/src/auth/oauth2client.js:598:19)
    at OAuth2Client.verifyIdTokenAsync (/Users/oriman/github/vad_scheduler/node_modules/google-auth-library/build/src/auth/oauth2client.js:458:34)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async verifyToken (/Users/oriman/github/vad_scheduler/src/auth/google.js:12:20)
    at async Object.exports.auth (/Users/oriman/github/vad_scheduler/src/auth/google.js:83:31)
    at async Object.exports.request (/Users/oriman/github/vad_scheduler/src/auth/index.js:76:27)
    at async main (/Users/oriman/github/vad_scheduler/index.js:59:24)
    */
    console.error('유효하지 않은 토큰:', error.message);
    // 추가 처리를 여기에 추가합니다.
    if (error.message === 'Invalid token signature') {
      // 토큰 서명이 유효하지 않은 경우 처리
      console.log('토큰 서명이 유효하지 않습니다.');
    } else if (error.message === 'Expired token') {
      // 토큰이 만료된 경우 처리
      console.log('토큰이 만료되었습니다.');
    } else {
      // 기타 다른 오류 처리
      console.log('오류가 발생했습니다:', error.message);
    }
    return false;
  }
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/adwords',
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

// 구글 인증처리
exports.auth = async function (userId) {
  // const oAuth2Client = await getAuthenticatedClient();
  // const CLIENT_SECRET = CONF.GOOGLE.CLINET_SECRET;
  // const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
  // const client = new OAuth2Client(clientId, CLIENT_SECRET, REDIRECT_URI);

  //
  //
  //
  //
  //
  //
  //

  // 구글 토큰 정보 db 조회
  const vad = await db.connection(CONFDB.DB.NAME); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const adAccountsInfo = vad.collection(CONFDB.DB.ACCOUNTS);
  const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'google', status: 1 }).toArray();
  console.log('google > authInfoList =', authInfoList);
  /*
    [
      {
        _id: new ObjectId("63ec7a524329cf21039157c6"),
        access_token: 'ya29.a0AVvZVsrg99V1Humwan6pDzsKgBXMKaTwTBYr709bQ31jJkABqxf-myDDv1mtlfIkreWnCT87DR0BEpxh3tz6p2W2JhKxXNzzA9hFOQ84FHTMCQ1V0GpubvgFRXnsyHoF7bE7UOxztEPV9otUmaaQn5s9bgXyv_waCgYKAaESARESFQGbdwaIF3I_t5cTrf5TaYzyvJNtEA0166',
        token_type: 'bearer',
        refresh_token: 'ck9anXtmt0jRx3d7ffWe-35nNKm7vRPDDJghO--UCiolEQAAAYYqYXRn',
        expires_in: 21599,
        refresh_token_expires_in: 5183999,
        userId: 'Vadmin',
        auth_type: 'google',
        createdAt: 2023-02-07T05:32:51.483Z,
        status: 1,
        ga4: 'ya29.a0AWY7CknKBFF0RyIUlkP9D0Ycc9x3ca8QhhYtWPlIesrV6KGa0EhdMs0m3R8w2nOcJDUTp2ouGOwX8vXMFRYmwFHxnyd6_UkUFZ2zTPvDJ3ii0C5Y2d8KAgFWmf-epeD4gec275vwf4kPT1QMk3yHChSQLTDbDL0aCgYKASsSARESFQG1tDrpxDH_uc7UScSBQAQ2FNlvjQ0166'
      }
    ]
  */

  let authInfo;
  if (authInfoList.length === 0) {
    // api를 호출하기 위한 토큰 정보가 없다면
    // 인증처리요청 필요
    //
  } else if (authInfoList.length === 1) {
    // 토큰 정보가 1개만 있다면
    // 1. 토큰 정보 유효성 확인
    // 새 Axios 객체를 만듭니다.
    const client = axios.create({
      baseURL: 'https://accounts.google.com/o/oauth2/v2/auth',
      headers: {
        Authorization: `Bearer ${authInfoList[0].access_token}`,
      },
    });
    // 토큰을 유효성 검사하기 위해 Google Ads API에 요청을 보냅니다.
    const response = await client.get('/tokeninfo');
    // console.log('구글 토큰 인증 response =', response);

    // const verifyTokenResult = await verifyToken(authInfoList[0].access_token);
    // if (verifyTokenResult) {
    //   // 인증 성공
    //   console.log('구글 토큰 인증 성공');
    // } else {
    //   // 인증 실패
    //   console.log('구글 토큰 인증 실패');
    // }
    authInfo = { type: 'google', access_token: authInfoList[0].access_token, user_id: userId, ga4: authInfoList[0].ga4 };
  } else if (authInfoList.length > 1) {
    // 토큰 정보가 여러개 있다면
  }

  return authInfo;
};
