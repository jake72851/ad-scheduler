const db = require('../db/connect')
const CONF = require('../config/api')
const { GoogleAdsApi, ResourceNames, enums, resources } = require('google-ads-api')
const dayjs = require("dayjs")


//구글 api 호출
exports.request = async function (access_token, user_id, customer_id) {

    const Vad = await db.connection('vad') //DB이름을 지정하지 않으면 첫번째DB로 지정됨
    const user_google = Vad.collection('user_' + user_id + '_google')

    //GCP account : for-marketing / oauth id - vad
    const client = new GoogleAdsApi({
        client_id: CONF.GOOGLE.CLIENT_ID,
        client_secret: CONF.GOOGLE.CLINET_SECRET,
        developer_token: CONF.GOOGLE.DEVELOPER_TOKEN,
    }) 

    //하위 계정정보 요청
    const customer = client.Customer({
        customer_id: customer_id,
        login_customer_id: CONF.GOOGLE.LOGIN_CUSTOMER_ID,
        refresh_token: access_token,
    })
    //console.log('customer_id =', customer_id)

    const now_day = dayjs().format('YYYY-MM-DD')
            
    const query = await customer.query(`
        SELECT 
            asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.business_name_filter.business_name, 
            asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.business_name_filter.filter_type, 
            asset_set.business_profile_location_group.dynamic_business_profile_location_group_filter.label_filters, 
            asset_set.id, 
            asset_set.location_set.business_profile_location_set.business_name_filter, 
            asset_set.location_set.business_profile_location_set.label_filters, 
            asset_set.location_set.business_profile_location_set.listing_id_filters, 
            asset_set.location_set.chain_location_set.relationship_type, 
            asset_set.location_set.location_ownership_type, 
            asset_set.merchant_center_feed.feed_label, 
            asset_set.merchant_center_feed.merchant_id, 
            asset_set.name, 
            asset_set.resource_name, 
            asset_set.status, 
            asset_set.type, 
            customer.id, 
            customer.manager, 
            customer.resource_name, 
            customer.status 
        FROM asset_set 
    `)
    console.log('asset_set =', query)
    const data = {
        api_id: 'adAccounts/id/asset_set',
        asset_set: query,
        created_day: now_day,
    }
    await user_google.updateOne( {api_id: 'adAccounts/id/asset_set', adAccountId: customer_id, created_day: data.created_day}, {$set: data}, { upsert: true } )
    
}