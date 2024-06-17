const config = {
  LOCAL: {
    URL: 'mongodb://localhost:27017/',
    OPTION: {
      DBNAME: 'vad',
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useUnifiedTopology: true
    },
  },
  REMOTE: {
    URL: 'mongodb+srv://...vad.bumf0.mongodb.net/?retryWrites=true&w=majority',
    option: {
      dbName: 'vad',
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    },
  },
  DB: {
    NAME: 'vad3',
    USERS: 'users',
    ACCOUNTS: 'ad_accounts',
    FACEBOOK: {
      COLLECTION: 'user_facebook',
      RESULT_INFO: 'facebook_result_info',
    },
    GOOGLE: {
      COLLECTION: 'user_google',
      GEO: 'google_geo_info',
    },
    TIKTOK: {
      COLLECTION: 'user_tiktok',
      REGION: 'tiktok_region_info',
      LANGUAGE: 'tiktok_language_info',
      CATEGORY: 'tiktok_category_info',
    },
    KAKAO: {
      COLLECTION: 'user_kakao',
    },
    NAVER: {
      COLLECTION: 'user_naver',
    },
    MAPPING: {
      COLLECTION: 'media_indicator_mapping',
    },
    REPORT: {
      COLLECTION: 'excel_report',
    },
    JSON: {
      COLLECTION: 'json_report',
    },
  },
  TEST: {
    local_url: 'mongodb://127.0.0.1:27017/rest_api',
    url: 'mongodb+srv://vad.bumf0.mongodb.net/vad2?retryWrites=true&w=majority&readPreference=primaryPreferred',
    option: {
      user: '...',
      pass: '...',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

module.exports = config;
