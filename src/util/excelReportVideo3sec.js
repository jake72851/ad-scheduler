exports.request = async function (actions) {
  try {
    const actionValue = actions.find((action) => action.action_type === 'video_view')?.value;
    // console.log('actionValue =', actionValue);
    let result = '';
    if (actionValue) {
      result = actionValue;
    }
    return result;
  } catch (err) {
    console.log(err.message);
    return err;
  }
};
