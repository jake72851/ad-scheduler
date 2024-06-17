const axios = require('axios');

const makeFormData = (params) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
  return searchParams;
};

exports.request = async function (methodParam, uri, param, data, header) {
  /*
    console.log("axios uri =", uri)
    console.log("axios method =", method)
    console.log("axios header =", header)
    console.log("axios param =", param)
    console.log("axios data =", data)
  */
  let rtn;
  try {
    if (header) {
      rtn = await axios({
        method: methodParam,
        url: uri,
        params: param,
        data: makeFormData(data),
        headers: header,
      });
    } else {
      rtn = await axios({
        method: methodParam,
        url: uri,
        params: param,
        data: makeFormData(data),
      });
    }
    /*
    if (param) {
        rtn = await axios({
            method: method,
            url: uri,
            data: makeFormData(param),
            headers: header
        })
    } else {
        console.log("axios param X")
        rtn = await axios({
            method: method,
            url: uri,
            headers: header
        })
    }
    */
  } catch (err) {
    rtn = err.response;
  }
  return rtn.data;
};
