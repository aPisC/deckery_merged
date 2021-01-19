const map = {};

function isLocked(id) {
  return map[id];
}

function lock(id) {
  if (isLocked(id)) throw new Error('CardLocker Error, id already lockled');
  map[id] = true;
  return () => delete map[id];
}

module.exports = {
  lock,
  isLocked,
};
