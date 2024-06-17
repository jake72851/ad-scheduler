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
            display_keyword_view.resource_name, 
            metrics.active_view_cpm, 
            metrics.active_view_ctr, 
            metrics.active_view_viewability, 
            metrics.all_conversions, 
            metrics.all_conversions_from_interactions_rate, 
            metrics.all_conversions_value, 
            metrics.all_conversions_from_interactions_value_per_interaction, 
            metrics.all_conversions_value_per_cost, 
            metrics.average_cost, 
            metrics.average_cpc, 
            metrics.average_cpe, 
            metrics.average_cpm, 
            metrics.average_cpv, 
            metrics.clicks, 
            metrics.conversions, 
            metrics.conversions_from_interactions_rate, 
            metrics.conversions_value, 
            metrics.cost_per_conversion, 
            metrics.cost_per_all_conversions, 
            metrics.ctr, 
            metrics.cross_device_conversions, 
            metrics.gmail_secondary_clicks, 
            metrics.interaction_rate, 
            metrics.interactions, 
            metrics.value_per_all_conversions, 
            metrics.value_per_conversion, 
            metrics.video_quartile_p100_rate, 
            metrics.video_quartile_p25_rate, 
            metrics.video_quartile_p50_rate, 
            metrics.video_quartile_p75_rate, 
            metrics.video_view_rate, 
            metrics.video_views, 
            ad_group.campaign, 
            ad_group.effective_target_roas, 
            ad_group.effective_target_roas_source, 
            ad_group.id, 
            ad_group.name, 
            ad_group.labels, 
            ad_group.resource_name, 
            ad_group.status, 
            ad_group.target_roas, 
            ad_group_criterion.ad_group, 
            ad_group_criterion.criterion_id, 
            ad_group_criterion.display_name, 
            ad_group_criterion.labels, 
            ad_group_criterion.listing_group.type, 
            ad_group_criterion.mobile_application.app_id, 
            ad_group_criterion.status, 
            ad_group_criterion.resource_name, 
            ad_group_criterion.type, 
            campaign.id, 
            campaign.labels, 
            campaign.manual_cpa, 
            campaign.manual_cpm, 
            campaign.manual_cpv, 
            campaign.name, 
            campaign.maximize_conversion_value.target_roas, 
            campaign.target_cpm, 
            customer.id, 
            customer.manager, 
            customer.resource_name, 
            customer.status, 
            segments.date 
        FROM display_keyword_view 
        WHERE 
            segments.date = '`+now_day+`'
    `)
    console.log('display_keyword_view =', query)
    const data = {
        api_id: 'adAccounts/id/display_keyword_view',
        display_keyword_view: query,
        created_day: now_day,
    }
    await user_google.updateOne( {api_id: 'adAccounts/id/display_keyword_view', adAccountId: customer_id, created_day: data.created_day}, {$set: data}, { upsert: true } )
    
}