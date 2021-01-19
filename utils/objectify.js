module.exports = function objectify(list, key = 'id') {
  const r = {};
  list.forEach(i => r[i[key]] = i);
  return r;
};