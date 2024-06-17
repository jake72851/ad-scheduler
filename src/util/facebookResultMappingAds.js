const CONF = require('../config/api');

exports.request = async function (actions, objective, optimizationGoal, conversions, conversionValues) {
  // console.log('billing_event =', value.billing_event);
  // console.log('bid_amount =', value.bid_amount);
  // console.log('actions =', actions);
  // console.log('objective =', objective);
  // console.log('optimizationGoal =', optimizationGoal);
  // console.log('conversions =', conversions);
  // console.log('conversionValues =', conversionValues);

  let resultValue = 0;
  // OFFSITE_CONVERSIONS 외에 일반적인 케이스
  // console.log('result optimizationGoal =', CONF.FACEBOOK.RESULT_MAPPING_OPTIMIZATION[optimizationGoal]);
  if (actions) {
    const results = actions
      .filter((obj) => obj.action_type.includes(CONF.FACEBOOK.RESULT_MAPPING_OPTIMIZATION[optimizationGoal].name))
      .map((obj) => {
        // console.log('obj =', obj);
        // obj = { action_type: 'mobile_app_install', value: '5' }
        return obj.value;
      });
    if (results.length > 0) {
      resultValue = results[0];
    }
  }

  // console.log('result objective > optimizationGoal =', CONF.FACEBOOK.RESULT_MAPPING[objective][optimizationGoal]);
  // console.log('resultValue =', resultValue);
  /*
  if (promoted_object && promoted_object.custom_event_type) {
    console.log('promoted_object 있음');
  } else {
    console.log('promoted_object 없음');
  }
  */
  return resultValue;
};
