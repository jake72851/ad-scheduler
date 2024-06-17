const CONF = require('../config/api');

exports.request = async function (
  attributionSpec,
  promotedObject,
  actions,
  objective,
  optimizationGoal,
  conversions,
  conversionValues,
  actionAttributionWindows
) {
  // console.log('attributionSpec =', attributionSpec);
  // console.log('promotedObject =', promotedObject);
  // console.log('billing_event =', value.billing_event);
  // console.log('bid_amount =', value.bid_amount);
  // console.log('actions =', actions);
  // console.log('objective =', objective);
  // console.log('optimizationGoal =', optimizationGoal);
  // console.log('conversions =', conversions);
  // console.log('conversionValues =', conversionValues);

  let resultValue = 0;
  // OFFSITE_CONVERSIONS
  if (optimizationGoal === 'OFFSITE_CONVERSIONS') {
    if (promotedObject && promotedObject.custom_event_type) {
      if (promotedObject.custom_event_type === 'OTHER') {
        // OTHER 는 custom_event_str: 'TypeformSubmit' 경우로 예상
        if (promotedObject.custom_event_str && conversions) {
          const results = conversions
            .filter((obj) => obj.action_type.includes(promotedObject.custom_event_str))
            .map((obj) => {
              let sum = 0;
              for (const key of actionAttributionWindows) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key)) {
                  sum += Number(obj[key]);
                }
              }
              return sum;
            });
          resultValue = results[0];
        }
      } else if (promotedObject.custom_event_type === 'COMPLETE_REGISTRATION') {
        // COMPLETE_REGISTRATION 는 custom_conversion_id: '569024068298356' 경우로 예상
        if (promotedObject.custom_conversion_id) {
          // custom_conversion_id 가 있는 경우
          const results = actions
            .filter((obj) => obj.action_type.includes(promotedObject.custom_conversion_id))
            .map((obj) => {
              let sum = 0;
              for (const key of actionAttributionWindows) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key)) {
                  sum += Number(obj[key]);
                }
              }
              return sum;
            });
          resultValue = results[0];
        }
      } else if (promotedObject.custom_event_type === 'CONTACT') {
        // CONTACT 는 conversions 의 action_type: 'contact_total' 경우로 예상
        if (conversions) {
          // custom_conversion_id 가 있는 경우
          const results = conversions
            .filter((obj) => obj.action_type.includes('contact_total'))
            .map((obj) => {
              let sum = 0;
              for (const key of actionAttributionWindows) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key)) {
                  sum += Number(obj[key]);
                }
              }
              return sum;
            });
          resultValue = results[0];
        }
      } else if (promotedObject.custom_event_type === 'PURCHASE') {
        // PURCHASE 는 actions 의 action_type: 'offsite_conversion.fb_pixel_purchase' 경우로 예상
        if (conversions) {
          // custom_conversion_id 가 있는 경우
          const results = actions
            .filter((obj) => obj.action_type.includes('offsite_conversion.fb_pixel_purchase'))
            .map((obj) => {
              let sum = 0;
              for (const key of actionAttributionWindows) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key)) {
                  sum += Number(obj[key]);
                }
              }
              return sum;
            });
          resultValue = results[0];
        }
      } else {
        // OTHER, COMPLETE_REGISTRATION 이 아닌 경우
        console.log(
          'OTHER, COMPLETE_REGISTRATION, CONTACT, PURCHASE 이 아닌 예외케이스 발생 =',
          promotedObject.custom_event_type
        );
      }
    } else {
      // OFFSITE_CONVERSIONS 이면서 promotedObject 혹은 promotedObject.custom_event_type 가 없는 경우
    }
  } else {
    // OFFSITE_CONVERSIONS 외에 일반적인 케이스
    // console.log('result optimizationGoal =', CONF.FACEBOOK.RESULT_MAPPING_OPTIMIZATION[optimizationGoal]);
    const results = actions
      .filter((obj) => obj.action_type.includes(CONF.FACEBOOK.RESULT_MAPPING_OPTIMIZATION[optimizationGoal].name))
      .map((obj) => {
        let sum = 0;
        for (const key of actionAttributionWindows) {
          // eslint-disable-next-line no-prototype-builtins
          if (obj.hasOwnProperty(key)) {
            sum += Number(obj[key]);
          }
        }
        return sum;
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
