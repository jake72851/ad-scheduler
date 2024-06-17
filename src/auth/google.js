const db = require('../db/connect');
const CONFDB = require('../config/db');
const CONF = require('../config/api');

const http = require('http');
const url = require('url');
const { OAuth2Client } = require('google-auth-library');

const axios = require('axios');

const clientId = CONF.GOOGLE.CLIENT_ID;
const clientSecret = CONF.GOOGLE.CLINET_SECRET;
const redirectUri = CONF.GOOGLE.REDIRECT_URI;

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    const userId = payload.sub;
    return true;
  } catch (error) {
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

function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/adwords',
    });

    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
            const code = qs.get('code');
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            const r = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(r.tokens);
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}

// 구글 인증처리
exports.auth = async function (userId) {

  // 구글 토큰 정보 db 조회
  const vad = await db.connection(CONFDB.DB.NAME); // DB이름을 지정하지 않으면 첫번째DB로 지정됨
  const adAccountsInfo = vad.collection(CONFDB.DB.ACCOUNTS);
  const authInfoList = await adAccountsInfo.find({ user_id: userId, auth_type: 'google', status: 1 }).toArray();

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
    authInfo = { type: 'google', access_token: authInfoList[0].access_token, user_id: userId, ga4: authInfoList[0].ga4 };
  } else if (authInfoList.length > 1) {
    // 토큰 정보가 여러개 있다면
  }

  return authInfo;
};
