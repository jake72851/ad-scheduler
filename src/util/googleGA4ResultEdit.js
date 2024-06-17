exports.request = async function (GA4Result) {
  const results = {};
  for (const items of GA4Result) {
    const metric = items.metricHeaders.map((obj) => obj.name);
    // console.log('metric =', metric);

    if (items.rows && items.rows.length > 0) {
      for (let i = 0; i < items.rows.length; i++) {
        const mainKey = items.rows[i].dimensionValues[0].value;
        // console.log('mainKey =', mainKey);

        const value = items.rows[i].metricValues.map((obj) => obj.value);
        // console.log('value =', value);

        // 배열을 순환하면서 기존에 사용된 key가 없을때만 초기화
        if (!Object.prototype.hasOwnProperty.call(results, mainKey)) {
          results[mainKey] = {};
        }

        for (let a = 0; a < metric.length; a++) {
          results[mainKey][metric[a]] = value[a];
        }
      }
    } else {
      console.log('metric에 대한 value 정보 없음');
    }
  }
  const resultArr = [];
  for (const [key, value] of Object.entries(results)) {
    resultArr.push({ ga4Item: key, ga4Metric: value });
  }
  return resultArr;
};
