module.exports = async function (action) {
  const promise =
    typeof action.promise === 'function' ? action.promise() : action.promise;
  return await promise;
};
